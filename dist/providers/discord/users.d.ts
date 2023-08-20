declare type CallbackOptions = {
    options: Options;
    request: Request;
};
declare type Options = {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    scope?: string;
    isLogEnabled?: boolean;
};
declare type Request = {
    url: string;
};
declare type CallbackResult = {
    user: User;
    tokens: Tokens;
};
declare type User = {
    [key: string]: any;
};
declare type Tokens = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
};
declare type GetTokensFromCodeOptions = {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    scope?: string;
};
export declare function getTokensFromCode(code: string, { clientId, clientSecret, redirectUrl, scope }: GetTokensFromCodeOptions): Promise<Tokens>;
export declare function getUser(oauthData: Tokens): Promise<User>;
export default function callback({ options, request }: CallbackOptions): Promise<CallbackResult>;
export {};
