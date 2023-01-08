declare type GoogleOAuthOptions = {
    clientId: string;
    redirectUrl: string;
    scope?: string;
    responseType?: string;
    state?: string;
};
export default function redirect({ options }: {
    options: GoogleOAuthOptions;
}): Promise<string>;
export {};
