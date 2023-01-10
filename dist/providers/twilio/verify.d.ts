declare type Claims = {
    [key: string]: any;
};
declare type Options = {
    kvProvider: any;
    phone: string;
    otp: string;
    secret?: string;
    claims?: Claims;
};
declare type Props = {
    options: Options;
};
export default function verify({ options }: Props): Promise<{
    id: string;
    token?: Promise<string>;
}>;
export {};
