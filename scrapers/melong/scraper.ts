import type { DownloadUrl, Movie, Scraper } from "../types.ts";
import { Scraper } from "../types.ts";

const baseUrl = "http://167.99.31.48/";

export class Melong extends Scraper {
	async search(name: string, page: number) {
		const url = new URL(`/page/${page}`, baseUrl);
		url.searchParams.set("s", name);
		const document = await this.getDocument(url.href);
		const articles = document.querySelectorAll("article > .bx");
		const promises = articles.map(async (article) => {
			const thumbnailUrl = article.querySelector(".limit > img")!.src;
			const title = article.querySelector("h2")!.textContent;
			const siteUrl = article.querySelector("a.tip")!.href;
			const downloadUrl: DownloadUrl[] = await this.getDownloadUrl(
				siteUrl,
			);
			return {
				provider: "melong",
				title,
				siteUrl,
				thumbnailUrl,
				downloadUrl,
			} as Movie;
		});
		return Promise.all(promises);
	}

	async getDownloadUrl(url: string): Promise<DownloadUrl[]> {
		const cached = this.lru.get(url);
		if (cached) {
			return cached;
		}

		const document = await this.getDocument(url);
		const downloadUrl = b() ?? c() ?? empty();
		this.lru.set(url, downloadUrl);
		return downloadUrl;

		function b() {
			const pEls = document.querySelectorAll(
				".infl > .bixbox > div > div > div > p",
			);
			const downloadUrl: DownloadUrl[] = [];
			for (const p of pEls) {
				const label = p.textContent.split(" ")[0];
				for (const a of p.querySelectorAll("a")) {
					const href = a.href;
					const server = a.textContent;
					downloadUrl.push({ label, href, server });
				}
			}
			if (downloadUrl.length === 0) {
				return null;
			}
			return downloadUrl;
		}

		function c() {
			const liEls = document.querySelectorAll(
				".dzdesu > ul li:has(> strong)",
			);
			const downloadUrl: DownloadUrl[] = [];
			for (const li of liEls) {
				const label = li.querySelector("strong").textContent;
				if (!label || label === "Linknya") {
					continue;
				}
				for (const a of li.querySelectorAll("a")) {
					const href = a.href;
					const server = a.textContent;
					downloadUrl.push({ label, href, server });
				}
			}
			if (downloadUrl.length === 0) {
				return null;
			}
			return downloadUrl;
		}

		function empty(): DownloadUrl[] {
			console.error(`cant scrape "${url}"`);
			return [];
		}
	}
}
