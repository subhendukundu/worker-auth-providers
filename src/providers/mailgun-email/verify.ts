import jwt from '@tsndr/cloudflare-worker-jwt';
import { ProviderVerifyOtpError } from '../../utils/errors';

async function generateJWT({ secret, to, claims }) {
	const customClaims = claims || {
		id: to
	};
	return jwt.sign({ exp: '24h', ...customClaims}, secret, { algorithm: 'HS256' });
}

export default async function verify({ options }) {
	const { kvProvider, to, otp, secret, claims } = options;

	const storedOtp = await kvProvider.get(to);

	if (!storedOtp || Number(otp) !== Number(storedOtp)) {
		throw new ProviderVerifyOtpError({
			message: 'OTP did not match!'
		});
	}

	const token = secret ? generateJWT({
		secret,
		to,
		claims
	}) : null;

	await kvProvider.delete(to);

	return token ? {
		id: to,
		token
	} : {
		id: to
	};
}
