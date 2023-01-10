export class UnknownError extends Error {
	constructor(params: { name?: string; message: string }) {
		super(params.message);
		this.name = params.name || 'UnknownError';
	}
}

export class ConfigError extends UnknownError {
	name = 'ConfigError';
}

export class TokenError extends UnknownError {
	name = 'TokenError';
}

export class ProviderGetUserError extends UnknownError {
	name = 'ProviderGetUserError';
}

export class ProviderSendOtpError extends UnknownError {
	name = 'ProviderSendOtpError';
}

export class ProviderVerifyOtpError extends UnknownError {
	name = 'ProviderVerifyOtpError';
}
