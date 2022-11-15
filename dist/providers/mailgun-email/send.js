import { getFixedDigitRandomNumber } from '../../utils/helpers';
import { ConfigError, UnknownError } from '../../utils/errors';
function urlEncodeObject(obj) {
    return Object.keys(obj)
        .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
        .join('&');
}
function sendMail({ params, apiKey, baseUrl }) {
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
export default async function send({ options }) {
    const { from, to, subject, otpLength = 4, text = 'Your verification code is: {OTP}', html, kvProvider, expirationTtl = 60, baseUrl, apiKey } = options;
    const otp = getFixedDigitRandomNumber(otpLength);
    if (otpLength < 4) {
        throw new ConfigError({
            message: 'OTP length can not be less then 4'
        });
    }
    const otpMessage = html
        ? html.replace('{OTP}', otp)
        : text.replace('{OTP}', otp);
    console.log('[region otp]', otp, otpMessage);
    const params = {
        from,
        to,
        subject,
        html: otpMessage,
    };
    try {
        const res = await sendMail({ params, baseUrl, apiKey });
        console.log('[success send]', res);
        const savedData = await kvProvider.put(to, otp, {
            expirationTtl
        });
        console.log('[savedData]', savedData);
        return res;
    }
    catch (e) {
        console.log('[error]', e.stack);
        throw new UnknownError({
            message: 'e.stack'
        });
    }
}
