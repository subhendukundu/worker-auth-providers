declare type SendOptions = {
    from: string;
    to: string;
    subject: string;
    otpLength?: number;
    text?: string;
    html?: string;
    kvProvider: {
        [key: string]: any;
    };
    expirationTtl?: number;
    baseUrl: string;
    apiKey: string;
    isLogEnabled?: boolean;
};
export default function send({ options }: {
    options: SendOptions;
}): Promise<Response>;
export {};
