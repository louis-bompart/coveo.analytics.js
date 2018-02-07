import { WebStorage } from './storage';
export declare const STORE_KEY: string;
export declare const MAX_NUMBER_OF_HISTORY_ELEMENTS: number;
export declare const MIN_THRESHOLD_FOR_DUPLICATE_VALUE: number;
export declare const MAX_VALUE_SIZE: number;
export declare class HistoryStore {
    private store;
    constructor(store?: WebStorage);
    addElement(elem: HistoryElement): void;
    getHistory(): HistoryElement[];
    private getHistoryWithInternalTime();
    setHistory(history: HistoryElement[]): void;
    clear(): void;
    getMostRecentElement(): HistoryElement;
    private cropQueryElement(elem);
    private isValidEntry(elem);
    private stripInternalTime(history);
}
export interface HistoryElement {
    name: string;
    value: string;
    time: string;
    internalTime?: number;
}
export interface HistoryViewElement extends HistoryElement {
    title?: string;
}
export default HistoryStore;
