declare type SpotifyOAuthOptions = {
    clientId: string;
    redirectUrl: string;
    scope?: string;
    responseType?: string;
    showDialog?: boolean;
};
export default function redirect({ options }: {
    options: SpotifyOAuthOptions;
}): Promise<string>;
export {};
