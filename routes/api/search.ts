import { HandlerContext } from "$fresh/server.ts";
import { melong } from "$singleton";
import * as r from "$utils/response.ts";

export const handler = async (req: Request, _ctx: HandlerContext): Response => {
	const name = new URL(req.url).searchParams.get("name");
	const result = await Promise.all([
		melong.search(name, 0),
	])
		.then((arr) => arr.flat());
	return new r.Json(result);
};
