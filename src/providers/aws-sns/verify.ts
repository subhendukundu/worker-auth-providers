import jwt from '@tsndr/cloudflare-worker-jwt';
import { ProviderVerifyOtpError } from '../../utils/errors';

type Claims = {
	[key: string]: any;
};

type Options = {
	kvProvider: any;
	phone: string;
	otp: string;
	secret?: string;
	claims?: Claims;
};

type Props = {
	options: Options;
};

type JwtOptions = {
	secret: string;
	phone: string;
	claims?: Claims
};

function generateJWT({ secret, phone, claims }: JwtOptions): Promise<string> {
	const customClaims = claims || {
		id: phone
	};
	return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)), ...customClaims }, secret, { algorithm: 'HS256' });
}

export default async function verify({ options }: Props): Promise<{ id: string; token?: Promise<string> }> {
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

	await kvProvider.delete(phone);

	return token ? {
		id: phone,
		token
	} : {
		id: phone
	};
}