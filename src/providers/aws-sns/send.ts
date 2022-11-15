import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { getFixedDigitRandomNumber } from '../../utils/helpers';
import { ConfigError, UnknownError } from '../../utils/errors';

export default async function send({ options }) {
	const {
		region,
		otpLength = 4,
		message = 'Your verification code is: {OTP}',
		phone,
		kvProvider,
		expirationTtl = 60,
		accessKeyId,
		secretAccessKey
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

	console.log('[region otp]', phone, region, otp, otpMessage);

	const params = {
		Message: otpMessage,
		PhoneNumber: phone
	};
	const command = new PublishCommand(params);

	try {
		const data = await client.send(command);
		console.log('[success send]', data);
		const savedData = await kvProvider.put(phone, otp, {
			expirationTtl
		});
		console.log('[savedData]', savedData);
		return data;
	} catch (e) {
		console.log('[error]', e.stack);
		throw new UnknownError({
			message: 'e.stack'
		});
	}
}