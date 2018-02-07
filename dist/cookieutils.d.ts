export declare class Cookie {
    static set(name: string, value: string, expiration?: number): void;
    static get(name: string): string;
    static erase(name: string): void;
}
