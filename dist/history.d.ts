import { WebStorage } from './storage';
export declare const STORE_KEY: string;
export declare const MAX_NUMBER_OF_HISTORY_ELEMENTS: number;
export declare class HistoryStore {
    private store;
    constructor(store?: WebStorage);
    addElement(elem: HistoryElement): void;
    getHistory(): HistoryElement[];
    setHistory(history: HistoryElement[]): void;
    clear(): void;
}
export interface HistoryElement {
    name: string;
    value: string;
    time: string;
}
export interface HistoryViewElement extends HistoryElement {
    title?: string;
}
export default HistoryStore;
