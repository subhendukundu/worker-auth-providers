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
export default function callback({ options, request }: CallbackOptions): Promise<{
    user: any;
    tokens: any;
}>;
export {};
