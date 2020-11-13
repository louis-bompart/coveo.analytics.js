import {IAnalyticsBeaconClientOptions} from './analyticsBeaconClient';
import {AnalyticsFetchClient} from './analyticsFetchClient';
import {
    AnyEventResponse,
    ClickEventRequest,
    ClickEventResponse,
    CustomEventRequest,
    CustomEventResponse,
    EventType,
    HealthResponse,
    SearchEventRequest,
    SearchEventResponse,
    ViewEventRequest,
    ViewEventResponse,
    VisitResponse,
    IRequestPayload,
    VariableArgumentsPayload,
} from '../events';
import {VisitorIdProvider} from './analyticsRequestClient';
import {hasWindow, hasDocument} from '../detector';
import {addDefaultValues} from '../hook/addDefaultValues';
import {enhanceViewEvent} from '../hook/enhanceViewEvent';
import {uuidv4} from './crypto';
import {
    convertKeysToMeasurementProtocol,
    isMeasurementProtocolKey,
    convertCustomMeasurementProtocolKeys,
} from './measurementProtocolMapper';
import {IRuntimeEnvironment, BrowserRuntime, NodeJSRuntime} from './runtimeEnvironment';
import HistoryStore from '../history';
import {isApiKey} from './token';

export const Version = 'v15';

export const Endpoints = {
    default: 'https://platform.cloud.coveo.com/rest/ua',
    production: 'https://platform.cloud.coveo.com/rest/ua',
    hipaa: 'https://platformhipaa.cloud.coveo.com/rest/ua',
};

export interface ClientOptions {
    token?: string;
    endpoint: string;
    version: string;
}

export type AnalyticsClientSendEventHook = <TResult>(eventType: string, payload: any) => TResult;
export type EventTypeConfig = {
    newEventType: EventType;
    variableLengthArgumentsNames?: string[];
    addVisitorIdParameter?: boolean;
    usesMeasurementProtocol?: boolean;
    removeUnknownKeys?: boolean;
};

export interface AnalyticsClient {
    sendEvent(eventType: string, ...payload: VariableArgumentsPayload): Promise<AnyEventResponse | void>;
    sendSearchEvent(request: SearchEventRequest): Promise<SearchEventResponse | void>;
    sendClickEvent(request: ClickEventRequest): Promise<ClickEventResponse | void>;
    sendCustomEvent(request: CustomEventRequest): Promise<CustomEventResponse | void>;
    sendViewEvent(request: ViewEventRequest): Promise<ViewEventResponse | void>;
    getVisit(): Promise<VisitResponse>;
    getHealth(): Promise<HealthResponse>;
    registerBeforeSendEventHook(hook: AnalyticsClientSendEventHook): void;
    addEventTypeMapping(eventType: string, eventConfig: EventTypeConfig): void;
    runtime: IRuntimeEnvironment;
    readonly currentVisitorId: string;
}

interface BufferedRequest {
    eventType: EventType;
    payload: any;
    handled: boolean;
}

export class CoveoAnalyticsClient implements AnalyticsClient, VisitorIdProvider {
    private get defaultOptions(): ClientOptions {
        return {
            endpoint: Endpoints.default,
            token: '',
            version: Version,
        };
    }

    public runtime: IRuntimeEnvironment;
    private visitorId: string;
    private analyticsFetchClient: AnalyticsFetchClient;
    private bufferedRequests: BufferedRequest[];
    private beforeSendHooks: AnalyticsClientSendEventHook[];
    private eventTypeMapping: {[name: string]: EventTypeConfig};
    private options: ClientOptions;

    constructor(opts: Partial<ClientOptions>) {
        if (!opts) {
            throw new Error('You have to pass options to this constructor');
        }

        this.options = {
            ...this.defaultOptions,
            ...opts,
        };

        this.visitorId = '';
        this.bufferedRequests = [];
        this.beforeSendHooks = [enhanceViewEvent, addDefaultValues];
        this.eventTypeMapping = {};

        const clientsOptions = {
            baseUrl: this.baseUrl,
            token: this.options.token,
            visitorIdProvider: this,
        };

        this.runtime = this.initRuntime(clientsOptions);
        this.analyticsFetchClient = new AnalyticsFetchClient(clientsOptions);

        this.initVisitorId();
    }

    private initRuntime(clientsOptions: IAnalyticsBeaconClientOptions) {
        if (hasWindow() && hasDocument()) {
            return new BrowserRuntime(clientsOptions, () => this.flushBufferWithBeacon());
        }

        return new NodeJSRuntime();
    }

    private get analyticsBeaconClient() {
        return this.runtime.beaconClient;
    }

    private get storage() {
        return this.runtime.storage;
    }

    private initVisitorId() {
        const existingVisitorId = this.visitorId || this.storage.getItem('visitorId') || '';
        this.currentVisitorId = existingVisitorId || uuidv4();
    }

    get currentVisitorId() {
        return this.visitorId;
    }

    set currentVisitorId(visitorId: string) {
        this.visitorId = visitorId;
        this.storage.setItem('visitorId', visitorId);
    }

    async sendEvent(
        eventType: EventType | string,
        ...payload: VariableArgumentsPayload
    ): Promise<AnyEventResponse | void> {
        const {
            newEventType: eventTypeToSend = eventType as EventType,
            variableLengthArgumentsNames = [],
            addVisitorIdParameter = false,
            usesMeasurementProtocol = false,
            removeUnknownKeys = true,
        } = this.eventTypeMapping[eventType] || {};

        type ProcessPayloadStep = (currentPayload: any) => any;
        const processVariableArgumentNamesStep: ProcessPayloadStep = (currentPayload) =>
            variableLengthArgumentsNames.length > 0
                ? this.parseVariableArgumentsPayload(variableLengthArgumentsNames, currentPayload)
                : currentPayload[0];
        const addVisitorIdStep: ProcessPayloadStep = (currentPayload) => ({
            visitorId: addVisitorIdParameter ? this.visitorId : '',
            ...currentPayload,
        });
        const setAnonymousUserStep: ProcessPayloadStep = (currentPayload) =>
            usesMeasurementProtocol ? this.ensureAnonymousUserWhenUsingApiKey(currentPayload) : currentPayload;
        const processBeforeSendHooksStep: ProcessPayloadStep = (currentPayload) =>
            this.beforeSendHooks.reduce((newPayload, current) => current(eventType, newPayload), currentPayload);
        const cleanPayloadStep: ProcessPayloadStep = (currentPayload) =>
            this.removeEmptyPayloadValues(currentPayload, eventType);
        const validateParams: ProcessPayloadStep = (currentPayload) => this.validateParams(currentPayload);
        const processMeasurementProtocolConversionStep: ProcessPayloadStep = (currentPayload) =>
            usesMeasurementProtocol ? convertKeysToMeasurementProtocol(currentPayload) : currentPayload;
        const removeUnknownParameters: ProcessPayloadStep = (currentPayload) =>
            usesMeasurementProtocol && removeUnknownKeys
                ? this.removeUnknownParameters(currentPayload)
                : currentPayload;
        const processCustomParameters: ProcessPayloadStep = (currentPayload) =>
            usesMeasurementProtocol ? this.processCustomParameters(currentPayload) : currentPayload;

        const payloadToSend = [
            processVariableArgumentNamesStep,
            addVisitorIdStep,
            setAnonymousUserStep,
            processBeforeSendHooksStep,
            cleanPayloadStep,
            validateParams,
            processMeasurementProtocolConversionStep,
            removeUnknownParameters,
            processCustomParameters,
        ].reduce((payload, step) => step(payload), payload);

        this.bufferedRequests.push({
            eventType: eventTypeToSend,
            payload: payloadToSend,
            handled: false,
        });

        await this.deferExecution();
        return await this.sendFromBufferWithFetch();
    }

    private deferExecution(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, 0));
    }

    private flushBufferWithBeacon(): void {
        while (this.hasPendingRequests()) {
            const {eventType, payload} = this.bufferedRequests.pop() as BufferedRequest;
            this.analyticsBeaconClient.sendEvent(eventType, payload);
        }
    }

    private async sendFromBufferWithFetch(): Promise<AnyEventResponse | void> {
        const popped = this.bufferedRequests.shift();
        if (popped) {
            const {eventType, payload} = popped;
            return this.analyticsFetchClient.sendEvent(eventType, payload);
        }
    }

    private hasPendingRequests(): boolean {
        return this.bufferedRequests.length > 0;
    }

    public clear() {
        this.storage.removeItem('visitorId');
        const store = new HistoryStore();
        store.clear();
    }

    async sendSearchEvent(request: SearchEventRequest): Promise<SearchEventResponse | void> {
        return this.sendEvent(EventType.search, request);
    }

    async sendClickEvent(request: ClickEventRequest): Promise<ClickEventResponse | void> {
        return this.sendEvent(EventType.click, request);
    }

    async sendCustomEvent(request: CustomEventRequest): Promise<CustomEventResponse | void> {
        return this.sendEvent(EventType.custom, request);
    }

    async sendViewEvent(request: ViewEventRequest): Promise<ViewEventResponse | void> {
        return this.sendEvent(EventType.view, request);
    }

    async getVisit(): Promise<VisitResponse> {
        const response = await fetch(`${this.baseUrl}/analytics/visit`);
        const visit = (await response.json()) as VisitResponse;
        this.visitorId = visit.visitorId;
        return visit;
    }

    async getHealth(): Promise<HealthResponse> {
        const response = await fetch(`${this.baseUrl}/analytics/monitoring/health`);
        return (await response.json()) as HealthResponse;
    }

    registerBeforeSendEventHook(hook: AnalyticsClientSendEventHook): void {
        this.beforeSendHooks.push(hook);
    }

    addEventTypeMapping(eventType: string, eventConfig: EventTypeConfig): void {
        this.eventTypeMapping[eventType] = eventConfig;
    }

    private parseVariableArgumentsPayload(fieldsOrder: string[], payload: VariableArgumentsPayload) {
        const parsedArguments: {[name: string]: any} = {};
        for (let i = 0, length = payload.length; i < length; i++) {
            const currentArgument = payload[i];
            if (typeof currentArgument === 'string') {
                parsedArguments[fieldsOrder[i]] = currentArgument;
            } else if (typeof currentArgument === 'object') {
                // If the argument is an object, it is considered the last argument of the chain. Its values should be returned as-is.
                return {
                    ...parsedArguments,
                    ...currentArgument,
                };
            }
        }
        return parsedArguments;
    }

    private isKeyAllowedEmpty(evtType: string, key: string) {
        const keysThatCanBeEmpty: Record<string, string[]> = {
            [EventType.search]: ['queryText'],
        };

        const match = keysThatCanBeEmpty[evtType] || [];
        return match.indexOf(key) !== -1;
    }

    private removeEmptyPayloadValues(payload: IRequestPayload, eventType: string): IRequestPayload {
        const isNotEmptyValue = (value: any) => typeof value !== 'undefined' && value !== null && value !== '';
        return Object.keys(payload)
            .filter((key) => this.isKeyAllowedEmpty(eventType, key) || isNotEmptyValue(payload[key]))
            .reduce(
                (newPayload, key) => ({
                    ...newPayload,
                    [key]: payload[key],
                }),
                {}
            );
    }

    private removeUnknownParameters(payload: IRequestPayload): IRequestPayload {
        const newPayload = Object.keys(payload)
            .filter((key) => {
                if (isMeasurementProtocolKey(key)) {
                    return true;
                } else {
                    console.log(key, 'is not processed by coveoua');
                }
            })
            .reduce(
                (newPayload, key) => ({
                    ...newPayload,
                    [key]: payload[key],
                }),
                {}
            );
        return newPayload;
    }

    private processCustomParameters(payload: IRequestPayload): IRequestPayload {
        const {custom, ...rest} = payload;

        const newPayload = convertCustomMeasurementProtocolKeys(rest);

        return {
            ...(custom || {}),
            ...newPayload,
        };
    }

    private validateParams(payload: IRequestPayload): IRequestPayload {
        const {anonymizeIp, ...rest} = payload;
        if (anonymizeIp !== undefined) {
            if (['0', 'false', 'undefined', 'null', '{}', '[]', ''].indexOf(`${anonymizeIp}`.toLowerCase()) == -1) {
                rest['anonymizeIp'] = 1;
            }
        }
        return rest;
    }

    private ensureAnonymousUserWhenUsingApiKey(payload: IRequestPayload): IRequestPayload {
        const {userId, ...rest} = payload;
        if (isApiKey(this.options.token) && !userId) {
            rest['userId'] = 'anonymous';
            return rest;
        } else {
            return payload;
        }
    }

    private get baseUrl(): string {
        const {version, endpoint} = this.options;
        const endpointIsCoveoProxy = endpoint.indexOf('.cloud.coveo.com') !== -1;
        return `${endpoint}${endpointIsCoveoProxy ? '' : '/rest'}/${version}`;
    }
}

export default CoveoAnalyticsClient;
