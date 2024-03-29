import jwt from '@tsndr/cloudflare-worker-jwt';
import { ProviderVerifyOtpError } from '../../utils/errors';
async function generateJWT({ secret, phone, claims }) {
    const customClaims = claims || {
        id: phone
    };
    return jwt.sign({ exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)), ...customClaims }, secret, { algorithm: 'HS256' });
}
export default async function verify({ options }) {
    const { kvProvider, phone, otp, secret, claims } = options;
    const storedOtp = await kvProvider.get(phone);
    if (!storedOtp || Number(otp) !== Number(storedOtp)) {
        throw new ProviderVerifyOtpError({
            message: 'OTP length can not be less then 4'
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
