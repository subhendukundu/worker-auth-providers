import jwt from "@tsndr/cloudflare-worker-jwt";
import { getJwt } from '../../../../lib/utils/session';

export const onRequestGet: PagesFunction<{ WORKER_AUTH_PROVIDERS_STORE: KVNamespace, ENCODE_JWT_TOKEN: string }> = async ({ request, env }) => {
  try {
    const encodedToken = getJwt(request);
    const secret = env.ENCODE_JWT_TOKEN as string;
    console.log("[encodedToken]", encodedToken);
    const decoded = jwt.verify(encodedToken, secret);
    console.log(decoded);
    //@ts-ignore
    const userData = await env.WORKER_AUTH_PROVIDERS_STORE.get(decoded?.user_id, "json");
    return new Response(
      JSON.stringify(userData),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (err) {
    return new Response(
      "Unauthorized!",
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
};