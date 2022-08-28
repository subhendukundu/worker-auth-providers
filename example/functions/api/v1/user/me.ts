import type { ApiEndpoint } from 'vitedge'
import { BadRequestError } from "vitedge/errors";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { getJwt } from '../../../../src/utils/session';

export default <ApiEndpoint>{
  async handler({ request }) {
    if (request.method !== "GET") {
        throw new BadRequestError("Method not supported!");
    }
    try {
        const encodedToken = getJwt(request);
        const secret = process.env.VITEDGE_ENCODE_JWT_TOKEN;
        console.log("[encodedToken]", encodedToken);
        const decoded = jwt.verify(encodedToken, secret);
        console.log(decoded);
        //@ts-ignore
        const userData = await WORKER_AUTH_PROVIDERS_STORE.get(decoded?.user_id, "json");
        return {
            data: userData,
        }
    } catch(err) {
        throw new BadRequestError("Unauthorized!");
    }
  },
}
