declare type RedirectOptions = {
    clientId: string;
    redirectUrl: string;
    scope?: string;
    responseType?: string;
    authType?: string;
    display?: string;
};
export default function redirect(options: RedirectOptions): Promise<string>;
export {};
