declare type CallbackOptions = {
    options: Options;
    request: Request;
};
declare type Options = {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
    fields?: string;
    isLogEnabled?: boolean;
};
declare type User = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
};
export declare function getTokensFromCode(code: string, { clientId, clientSecret, redirectUrl }: Options): Promise<{
    access_token: string;
    token_type: string;
    expires_in: number;
}>;
export declare function getUser(token: string, fields?: string): Promise<User>;
export default function callback({ options, request }: CallbackOptions): Promise<{
    user: any;
    tokens: any;
}>;
export {};
