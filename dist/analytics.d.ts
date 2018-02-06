/// <reference types="whatwg-fetch" />
import { SearchEventRequest, SearchEventResponse, ClickEventRequest, ClickEventResponse, CustomEventRequest, CustomEventResponse, ViewEventRequest, ViewEventResponse, VisitResponse, HealthResponse } from './events';
import { AnalyticsClient } from './analyticsclient';
import 'whatwg-fetch';
export declare const Version: string;
export declare const Endpoints: {
    default: string;
    production: string;
    dev: string;
    staging: string;
};
export interface ClientOptions {
    token?: string;
    endpoint?: string;
    version?: string;
}
export declare class Client implements AnalyticsClient {
    private endpoint;
    private token;
    private version;
    constructor(opts: ClientOptions);
    sendEvent(eventType: string, request: any): Promise<Response>;
    sendSearchEvent(request: SearchEventRequest): Promise<SearchEventResponse>;
    sendClickEvent(request: ClickEventRequest): Promise<ClickEventResponse>;
    sendCustomEvent(request: CustomEventRequest): Promise<CustomEventResponse>;
    sendViewEvent(request: ViewEventRequest): Promise<ViewEventResponse>;
    getVisit(): Promise<VisitResponse>;
    getHealth(): Promise<HealthResponse>;
    protected getRestEndpoint(): string;
    protected getHeaders(): any;
}
export default Client;
