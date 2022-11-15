export declare class UnknownError extends Error {
    constructor({ name, message }: {
        name?: string;
        message: any;
    });
}
export declare class ConfigError extends UnknownError {
    name: string;
}
export declare class TokenError extends UnknownError {
    name: string;
}
export declare class ProviderGetUserError extends UnknownError {
    name: string;
}
export declare class ProviderSendOtpError extends UnknownError {
    name: string;
}
export declare class ProviderVerifyOtpError extends UnknownError {
    name: string;
}
