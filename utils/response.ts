export class Json extends Response {
	constructor(
		body: unknown,
		status = 200,
		headers: Record<string, string> = {},
	) {
		super(JSON.stringify(body), {
			status,
			headers,
		});
	}
}
