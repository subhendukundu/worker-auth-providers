declare type Tokens = {
    [key: string]: any;
};
declare type User = {
    [key: string]: any;
};
declare type Options = {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    isLogEnabled?: boolean;
};
export declare function getTokensFromCode(code: string, { redirectUrl, clientId, clientSecret }: Options): Promise<Tokens>;
export declare function getUser(token: string): Promise<User>;
export default function callback({ options, request }: {
    options: Options;
    request: Request;
}): Promise<{
    user: User;
    tokens: Tokens;
}>;
export {};
