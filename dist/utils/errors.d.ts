export declare class UnknownError extends Error {
    constructor(params: {
        name?: string;
        message: string;
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
