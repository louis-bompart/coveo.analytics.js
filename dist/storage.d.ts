export declare let preferredStorage: WebStorage;
export interface WebStorage {
    getItem(key: string): string;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
}
export declare function getAvailableStorage(): WebStorage;
export declare class CookieStorage implements WebStorage {
    getItem(key: string): string;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
}
export declare class NullStorage implements WebStorage {
    getItem(key: string): string;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
}
