import { getFixedDigitRandomNumber } from '../../utils/helpers';
import { ConfigError, UnknownError } from '../../utils/errors';
import { logger } from '../../utils/logger';

type SendOptions = {
	from: string,
	to: string,
	subject: string,
	otpLength?: number,
	text?: string,
	html?: string,
	kvProvider: { [key: string]: any },
	expirationTtl?: number,
	baseUrl: string,
	apiKey: string,
	isLogEnabled?: boolean,
};

type SendParams = {
	from: string,
	to: string,
	subject: string,
	html: string,
};

type sendMailOptions = {
	params: SendParams,
	apiKey: string,
	baseUrl: string
};

function urlEncodeObject(obj: { [key: string]: any }): string {
	return Object.keys(obj)
		.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
		.join('&');
}

function sendMail({ params, apiKey, baseUrl }: sendMailOptions) {
	const dataUrlEncoded = urlEncodeObject(params);
	const opts = {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(`api:${apiKey}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': dataUrlEncoded.length.toString()
		},
		body: dataUrlEncoded
	};

	return fetch(`${baseUrl}/messages`, opts);
}

export default async function send({ options }: { options: SendOptions }): Promise<Response> {
	const {
		from,
		to,
		subject,
		otpLength = 4,
		text = 'Your verification code is: {OTP}',
		html,
		kvProvider,
		expirationTtl = 60,
		baseUrl,
		apiKey,
		isLogEnabled = false,
	} = options;
	logger.setEnabled(isLogEnabled);
	const otp = getFixedDigitRandomNumber(otpLength);

	if (otpLength < 4) {
		throw new ConfigError({
			message: 'OTP length can not be less then 4'
		});
	}

	const otpMessage = html
		? html.replace('{OTP}', otp)
		: text.replace('{OTP}', otp);

	logger.log(`[region otp], ${JSON.stringify(otpMessage)}`, 'info');

	const params = {
		from,
		to,
		subject,
		html: otpMessage,
	};

	try {
		const res = await sendMail({ params, baseUrl, apiKey });
		logger.log(`[success send], ${JSON.stringify(res)}`, 'info');
		const savedData = await kvProvider.put(to, otp, {
			expirationTtl
		});
		logger.log(`[savedData], ${JSON.stringify(savedData)}`, 'info');
		return res;
	} catch (e: any) {
		logger.log(`[error], ${JSON.stringify(e.stack)}`, 'error');
		throw new UnknownError({
			message: 'e.stack'
		});
	}
}
