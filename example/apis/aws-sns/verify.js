import { awsSNS } from 'worker-auth-providers'

export default async function verifyOtp(data) {
    console.log('[data]', data)
    const { phone, otp } = data
    try {
        const res = await awsSNS.verify({
            options: {
                phone,
                otp,
                kvProvider: WORKER_AUTH_PROVIDERS_STORE,
                secret: 'eydlklddkkldkdkd.longSHAKey',
            },
        })
        return new Response(JSON.stringify(res))
    } catch (e) {
        return new Response(JSON.stringify(e.stack), { status: 400 })
    }
}
