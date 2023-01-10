import jwt from '@tsndr/cloudflare-worker-jwt';
import { ProviderVerifyOtpError } from '../../utils/errors';

type Claims = {
	[key: string]: any;
};

type JwtOptions = {
	secret: string;
	to: string;
	claims?: Claims
};

type Options = {
	kvProvider: any;
	to: string;
	otp: string;
	secret?: string;
	claims?: Claims;
};

type Props = {
	options: Options;
};

async function generateJWT({ secret, to, claims }: JwtOptions): Promise<string> {
	const customClaims = claims || {
		id: to
	};
	return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)), ...customClaims }, secret, { algorithm: 'HS256' });
}

export default async function verify({ options }: Props): Promise<{ id: string; token?: Promise<string> }> {
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
