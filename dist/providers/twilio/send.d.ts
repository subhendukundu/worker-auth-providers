declare type Options = {
    region: string;
    otpLength?: number;
    message?: string;
    phone: string;
    kvProvider: any;
    expirationTtl?: number;
    accountSid: string;
    authToken: string;
    from: string;
    isLogEnabled?: boolean;
};
declare type Props = {
    options: Options;
};
export default function send({ options }: Props): Promise<any>;
export {};
