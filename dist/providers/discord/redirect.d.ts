declare type Options = {
    clientId: string;
    redirectUrl: string;
    scope?: string;
    responseType?: string;
    prompt?: string;
    permissions?: string;
    guildId?: string;
    disableGuildSelect?: boolean;
    state?: any;
};
declare type Props = {
    options: Options;
};
export default function redirect({ options }: Props): Promise<string>;
export {};
