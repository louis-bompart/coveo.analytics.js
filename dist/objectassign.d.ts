export interface IObjectAssign {
    (target: any, ...sources: any[]): any;
}
export declare const ponyfill: IObjectAssign;
export declare const assign: IObjectAssign;
export default assign;
