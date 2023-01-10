import jwt from "@tsndr/cloudflare-worker-jwt";
import { NextRequest } from "next/server";
import { getJwt } from '../../../../lib/utils/session';

export const config = {
  runtime: "experimental-edge",
};

export default async function (request: NextRequest) {
  if (request.method !== "GET") {
    return new Response(
      "Method not supported!",
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
  try {
      const encodedToken = getJwt(request);
      const secret = process.env.ENCODE_JWT_TOKEN as string;
      console.log("[encodedToken]", encodedToken);
      const decoded = jwt.verify(encodedToken, secret);
      console.log(decoded);
      //@ts-ignore
      const userData = await WORKER_AUTH_PROVIDERS_STORE.get(decoded?.user_id, "json");
      return new Response(
        JSON.stringify(userData),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
  } catch(err) {
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
}