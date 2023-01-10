import { getFixedDigitRandomNumber } from '../../utils/helpers';
import { ConfigError, UnknownError } from '../../utils/errors';
import { logger } from '../../utils/logger';

type Options = {
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

type Props = {
	options: Options;
};

export default async function send({ options }: Props): Promise<any> {
	const {
		region,
		otpLength = 4,
		message = 'Your verification code is: {OTP}',
		phone,
		kvProvider,
		expirationTtl = 60,
		accountSid,
		authToken,
		from = '+19388887573',
		isLogEnabled = false,
	} = options;
	const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
	const otp = getFixedDigitRandomNumber(otpLength);

	if (otpLength < 4) {
		throw new ConfigError({
			message: 'OTP length can not be less then 4'
		});
	}

	const otpMessage = message.replace('{OTP}', otp);
	logger.setEnabled(isLogEnabled);
	logger.log(`[region otp], ${JSON.stringify({
		phone, region, otp, otpMessage
	})}`, 'info');

	const encoded = new URLSearchParams();
	encoded.append('To', phone);
	encoded.append('From', from);
	encoded.append('Body', otpMessage);

	const token = btoa(`${accountSid}:${authToken}`);

	const request = {
		body: encoded,
		method: 'POST',
		headers: {
			Authorization: `Basic ${token}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

	try {
		const result = await fetch(endpoint, request);
		const data = await result.json();
		const savedData = await kvProvider.put(phone, otp, {
			expirationTtl
		});
		logger.log(`[savedData], ${JSON.stringify(savedData)}`, 'info');
		return data;
	} catch (e: any) {
		logger.log(`[error], ${JSON.stringify( e.stack)}`, 'error');
		throw new UnknownError({
			message: 'e.stack'
		});
	}
}
