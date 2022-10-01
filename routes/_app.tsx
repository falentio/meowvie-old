import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
	return (
		<>
			<Head>
				<style>
					{`
				@import url('https://fonts.googleapis.com/css2?family=Abel&display=swap');

				html {
					font-family: 'Abel', sans-serif;
				}
			`}
				</style>
			</Head>
			<div class="bg-gray-100">
				<div class="min-h-screen flex flex-col container">
					<Component />
				</div>
			</div>
		</>
	);
}
