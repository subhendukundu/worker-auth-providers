declare type SendOptions = {
    from: string;
    to: string;
    subject?: string;
    otpLength?: number;
    kvProvider: any;
    expirationTtl?: number;
    apiKey: string;
    templateId?: string;
    dynamicTemplateData?: any;
    text?: string;
    isLogEnabled?: boolean;
};
export default function send({ options }: {
    options: SendOptions;
}): Promise<Response>;
export {};
