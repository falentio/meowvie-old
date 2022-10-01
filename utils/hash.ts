const secret = new Uint8Array(64);
await crypto.getRandomValues(secret);
const key = await crypto.subtle.importKey(
	"raw",
	secret,
	{ name: "HMAC", hash: { name: "SHA-512" } },
	false,
	["sign", "verify"],
);

const textEncoder = new TextEncoder()

export async function sign(str: string) {
	const buffer = await crypto.subtle.sign("HMAC", key, textEncoder.encode(str))
	const mac = Array
		.from(new Uint8Array(buffer))
		.map(i => i.toString(16).padStart(2, "0"))
		.join("")
	return mac
}

export async function verify(str: string, mac: string) {
	return sign(str).then(i => mac === i)
}
