export interface CoveoUAGlobal {
    (action: string, ...params: string[]): void;
    q?: string[][];
    disableAutoHistory: boolean;
}
declare const coveoua: CoveoUAGlobal;
export default coveoua;
