import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { getFixedDigitRandomNumber } from '../../utils/helpers';
import { ConfigError, UnknownError } from '../../utils/errors';
import { logger } from '../../utils/logger';

export default async function send({ options }) {
	const {
		region,
		otpLength = 4,
		message = 'Your verification code is: {OTP}',
		phone,
		kvProvider,
		expirationTtl = 60,
		accessKeyId,
		secretAccessKey,
		isLogEnabled = false
	} = options;
	const client = new SNSClient({
		region,
		credentials: {
            accessKeyId,
            secretAccessKey
        }
	});
	const otp = getFixedDigitRandomNumber(otpLength);

	if (otpLength < 4) {
		throw new ConfigError({
			message: 'OTP length can not be less then 4'
		});
	}

	const otpMessage = message.replace('{OTP}', otp);

	const params = {
		Message: otpMessage,
		PhoneNumber: phone
	};
	const command = new PublishCommand(params);

	try {
		const data = await client.send(command);
		logger.setEnabled(isLogEnabled);
		logger.log(`[success send]', ${JSON.stringify(data)}`, 'info');
		const savedData = await kvProvider.put(phone, otp, {
			expirationTtl
		});
		logger.log(`[savedData]: ${JSON.stringify(savedData)}`, 'info');
		return data;
	} catch (e) {
		logger.log(`[error]: ${JSON.stringify(e.stack)}`, 'error');
		throw new UnknownError({
			message: e.stack
		});
	}
}