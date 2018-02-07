import AnalyticsClient from './analyticsclient';
export declare class SimpleAPI {
    private client;
    init(token: string | AnalyticsClient, endpoint: string): void;
    send(event: EventType, customData: any): void;
    onLoad(callback: Function): void;
}
export declare type EventType = 'pageview';
export declare const SimpleAnalytics: (action: string, ...params: any[]) => any;
export default SimpleAnalytics;
