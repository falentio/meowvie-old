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

export class BadRequest extends Response {
	constructor(body: string, headers: Record<string, string> = {}) {
		super(body, { status: 400, headers })
	}
}