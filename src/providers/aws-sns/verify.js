import jwt from 'jsonwebtoken';
import { ProviderVerifyOtpError } from '../../utils/errors';

function generateHasuraJWT({ secret, phone }) {
	const claims = {
		id: phone
	};
	console.log('[claims, scret]', claims, secret);
	return jwt.sign(claims, secret, { algorithm: 'HS256', expiresIn: '24h' });
}

export default async function verify({ options }) {
	const { kvProvider, phone, otp, secret } = options;

	const storedOtp = await kvProvider.get(phone);

	if (!storedOtp || Number(otp) !== Number(storedOtp)) {
		throw new ProviderVerifyOtpError({
			message: 'OTP length can not be less then 4'
		});
	}

	const token = generateHasuraJWT({
		secret,
		phone
	});

	console.log(token);
	await kvProvider.delete(phone);

	return {
		id: phone,
		token
	};
}
