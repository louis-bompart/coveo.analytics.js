import {AnyEventResponse, SendEventArguments, VariableArgumentsPayload} from '../events';
import {AnalyticsClient, CoveoAnalyticsClient, Endpoints} from '../client/analytics';
import {Plugins} from './plugins';
import {EC} from '../plugins/ec';
import {SV} from '../plugins/sv';

export type AvailableActions = keyof CoveoUA;

// CoveoUA mimics the GoogleAnalytics API.
export class CoveoUA {
    private client?: AnalyticsClient;
    private plugins: Plugins = new Plugins();
    private params: {[name: string]: string} = {};

    // init initializes a new SimpleAPI client.
    // @param token is your coveo access_token / api_key / ...
    // @param endpoint is the endpoint you want to target defaults to the
    //        usage analytics production endpoint
    init(token: string | AnalyticsClient, endpoint: string): void {
        if (!token) {
            throw new Error(`You must pass your token when you call 'init'`);
        }

        if (typeof token === 'string') {
            endpoint = endpoint || Endpoints.default;
            this.client = new CoveoAnalyticsClient({
                token: token,
                endpoint: endpoint,
            });
        } else if (typeof token === 'object' && typeof token.sendEvent !== 'undefined') {
            this.client = token;
        }

        if (this.client) {
            this.plugins.register('ec', new EC({client: this.client}));
            this.plugins.register('sv', new SV({client: this.client}));
            this.client.registerBeforeSendEventHook((eventType, payload) => ({
                ...payload,
                ...this.params,
            }));
        } else {
            throw new Error(`You must pass either your token or a valid object when you call 'init'`);
        }
    }

    // init initializes a new client intended to be used with a proxy that injects the access token.
    // @param endpoint is the endpoint of your proxy.
    initForProxy(endpoint: string): void {
        if (!endpoint) {
            throw new Error(`You must pass your endpoint when you call 'initForProxy'`);
        }

        if (typeof endpoint !== 'string') {
            throw new Error(`You must pass a string as the endpoint parameter when you call 'initForProxy'`);
        }

        this.client = new CoveoAnalyticsClient({
            endpoint: endpoint,
        });
    }

    set(keyOrObject: string | any, value: string): void {
        if (typeof keyOrObject === 'string') {
            this.params[keyOrObject] = value;
        } else {
            Object.keys(keyOrObject).map((key) => {
                this.params[key] = keyOrObject[key];
            });
        }
    }

    send(...[event, ...payload]: SendEventArguments): Promise<AnyEventResponse | void> {
        if (typeof this.client == 'undefined') {
            throw new Error(`You must call init before sending an event`);
        }

        if (!event) {
            throw new Error(`You must provide an event type when calling "send".`);
        }

        return this.client.sendEvent(event.toLowerCase(), ...(payload as VariableArgumentsPayload));
    }

    onLoad(callback: Function) {
        if (typeof callback == 'undefined') {
            throw new Error(`You must pass a function when you call 'onLoad'`);
        }

        callback();
    }

    callPlugin(pluginName: string, fn: string, ...args: any): void {
        this.plugins.execute(pluginName, fn, ...args);
    }

    reset() {
        this.client = undefined;
        this.plugins = new Plugins();
        this.params = {};
    }
}

export const coveoua = new CoveoUA();

export const handleOneAnalyticsEvent = (command: string, ...params: any[]): any => {
    const [, trackerName, pluginName, fn] = /^(?:(\w+)\.)?(?:(\w+):)?(\w+)$/.exec(command)!;

    const actionFunction = (<any>coveoua)[fn];
    if (pluginName && fn) {
        return coveoua.callPlugin(pluginName, fn, ...params);
    } else if (actionFunction) {
        return actionFunction.apply(coveoua, params);
    } else {
        const actions: AvailableActions[] = ['init', 'set', 'send', 'onLoad', 'callPlugin'];
        throw new Error(`The action "${command}" does not exist. Available actions: ${actions.join(', ')}.`);
    }
};

export default handleOneAnalyticsEvent;
