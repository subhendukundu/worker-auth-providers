declare type Request = {
    url: string;
};
export declare function parseQuerystring(request: Request): {
    url: URL;
    query: Record<string, string>;
};
export declare function getFixedDigitRandomNumber(n: number): string;
export {};
