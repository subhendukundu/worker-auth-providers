import { awsSNS } from 'worker-auth-providers'

export default async function sendOtp(data) {
    console.log('[data]', data)
    const { phone } = data
    try {
        const res = await awsSNS.send({
            options: {
                phone,
                region: 'ap-south-1',
                kvProvider: HAAL_AUTH_PROVIDERS_STORE,
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
            },
        })
        return new Response(JSON.stringify(res))
    } catch (e) {
        return new Response(JSON.stringify(e.stack), { status: 400 })
    }
}
