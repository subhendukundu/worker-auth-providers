export class UnknownError extends Error {
	constructor({ name = 'UnknownError', message }) {
		super(message);
		this.name = name;
	}
}

export class ConfigError extends UnknownError {
	constructor() {
		super();
		this.name = 'ConfigError';
	}
}

export class TokenError extends UnknownError {
	constructor() {
		super();
		this.name = 'TokenError';
	}
}

export class ProviderGetUserError extends UnknownError {
	constructor() {
		super();
		this.name = 'ProviderGetUserError';
	}
}

export class ProviderSendOtpError extends UnknownError {
	constructor() {
		super();
		this.name = 'ProviderSendOtpError';
	}
}

export class ProviderVerifyOtpError extends UnknownError {
	constructor() {
		super();
		this.name = 'ProviderVerifyOtpError';
	}
}
