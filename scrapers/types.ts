import QuickLRU from "quick-lru";
import { parseHTML } from "linkedom";

export interface Movie {
	provider: string;
	name: string;
	siteUrl: string;
	thumbnailUrl?: string;
	downloadUrl: DownloadUrl[];
}

export interface DownloadUrl {
	label: string;
	href: string;
	server: string;
}

const lru = new QuickLRU<DownloadUrl>({ maxSize: 3000 });

export abstract class Scraper {
	protected lru = lru;
	async getDocument(url: string) {
		const res = await fetch(url, {
			headers: {
				"User-Agent": crypto.randomUUID(),
			},
		});
		if (!res.ok) {
			throw new Error("failed to fetch: " + url);
		}
		const text = await res.text();
		const { document } = parseHTML(text);
		return document;
	}

	abstract name(): string;
	abstract search(name: string, page?: number): Promise<Movie[]>;
}
