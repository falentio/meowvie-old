import type { DownloadUrl, Movie, Scraper } from "../types.ts";
import { Scraper } from "../types.ts";

const baseUrl = "https://pahe.li";

export class Pahe extends Scraper {
	async search(name: string) {
		const url = new URL(`/`, baseUrl);
		url.searchParams.set("s", name);
		console.log(url.href)
		const document = await this.getDocument(url.href);
		const liEls = document.querySelectorAll("li.timeline-post");
		console.log(liEls.length)
		const promises = liEls.map(async (li) => {
			const title = li.querySelector("h2")!.textContent;
			const siteUrl = li.querySelector("div.post-thumbnail > a")!.href
			const thumbnailUrl = li.querySelector("div.post-thumbnail > a > img")!.src
			console.log({siteUrl, thumbnailUrl})
			return {
				provider: "pahe",
			} as Movie;
		});
		return Promise.all(promises);
	}

	async getDownloadUrl(url: string): Promise<DownloadUrl[]> {
		function empty(): DownloadUrl[] {
			console.error(`cant scrape "${url}"`);
			return [];
		}
	}
}

await new Pahe().search("minions").then(console.log)