import { HandlerContext } from "$fresh/server.ts";
import { melong } from "$singleton";
import { sign } from "$utils/hash.ts"
import * as r from "$utils/response.ts";

export const handler = async (req: Request, _ctx: HandlerContext): Response => {
	const name = new URL(req.url).searchParams.get("name");
	const result = await Promise.all([
		melong.search(name, 0),
	])
		.then((arr) => arr.flat());
	for (const r of result) {
		const mac = await sign(r.thumbnailUrl)
		const url = new URL("/api/proxy", req.url)
		url.searchParams.set("target", r.thumbnailUrl)
		url.searchParams.set("mac", mac)
		r.thumbnailUrl = url.href
	}
	return new r.Json(result);
};
