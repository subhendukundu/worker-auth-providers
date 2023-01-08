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
    query: Query;
    url: string;
};
declare type Query = {
    code: string;
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
export default function callback({ options, request }: CallbackOptions): Promise<CallbackResult>;
export {};
