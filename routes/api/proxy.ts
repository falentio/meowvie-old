import { HandlerContext } from "$fresh/server.ts";
import { verify } from "$utils/hash.ts"
import * as r from "$utils/response.ts";

export const handler = async (req: Request, _ctx: HandlerContext): Response => {
	const url = new URL(req.url)
	const target = url.searchParams.get("target")
	const mac = url.searchParams.get("mac")
	const valid = await verify(target, mac)
	if (!mac || !target || !valid) {
		return new r.BadRequest("invalid query")
	}
	const res = await fetch(target)
	const headers = new Headers(res.headers)
	headers.set("cache-control", "public, max-age=3600")
	headers.delete("server")
	return new Response(res.body, { headers, status: res.status })
};
