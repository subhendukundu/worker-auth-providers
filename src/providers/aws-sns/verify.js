import jwt from '@tsndr/cloudflare-worker-jwt';
import { ProviderVerifyOtpError } from '../../utils/errors';

function generateJWT({ secret, phone, claims }) {
	const customClaims = claims || {
		id: phone
	};
	console.log('[claims, scret]', customClaims, secret);
	return jwt.sign(customClaims, secret, { algorithm: 'HS256', expiresIn: '24h' });
}

export default async function verify({ options }) {
	const { kvProvider, phone, otp, secret, claims } = options;

	const storedOtp = await kvProvider.get(phone);

	if (!storedOtp || Number(otp) !== Number(storedOtp)) {
		throw new ProviderVerifyOtpError({
			message: 'OTP did not match!'
		});
	}

	const token = secret ? generateJWT({
		secret,
		phone,
		claims
	}) : null;

	console.log(token);
	await kvProvider.delete(phone);

	return token ? {
		id: phone,
		token
	} : {
		id: phone
	};
}
