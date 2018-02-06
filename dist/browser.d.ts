export interface CoveoUAGlobal {
    (action: string, ...params: string[]): void;
    q?: string[][];
}
declare const coveoua: CoveoUAGlobal;
export default coveoua;
