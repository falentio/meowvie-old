import { useEffect, useState } from "preact/hooks";
import { Button } from "../components/Button.tsx";

interface MovieSectionProps {
}

export default function MovieSection(props: MovieSectionProps) {
	const [name, setName] = useState("");
	const [currentName, setCurrentName] = useState("");

	return (
		<>
			<section class="flex flex-col">
				<div class="bg-white rounded p-2 shadow border-l-4 border-blue-400">
					<h2 class="text-3xl">Cari Film</h2>
					<label class="flex flex-col my-2">
						<span>Judul Film:</span>
						<input
							onKeyUp={(e) => setName(e.target.value)}
							onKeyDown={(e) => setName(e.target.value)}
							type="text"
							name="movie-title"
							placeholder="minions"
							class="ring-1 focus:ring-2 ring-blue-400 focus:outline-none rounded-sm px-2 py-1"
						/>
					</label>
					<div class="w-full flex flex-row justify-end items-center my-2">
						<button
							onClick={() => setCurrentName(name)}
							disabled={name === ""}
							class="ring-blue-400 ring-1 focus:ring-2 p-1 rounded focus:outline-none w-12 disabled:text-gray-400 disabled:bg-gray-200"
						>
							Cari
						</button>
					</div>
				</div>
			</section>
			<ul class="w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded shadow my-4">
				<MovieCollection name={currentName} />
			</ul>
		</>
	);
}

function MovieCollection({ name }: { name: string }) {
	if (!name) {
		return
	}

	const [movies, setMovies] = useState([])
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)
		fetchMovie()
			.then(e => setError(e))
			.finally(() => setLoading(false))
	}, [name])

	async function fetchMovie() {
		const url = new URL("/api/search", window.location)
		url.searchParams.set("name", name)
		const res = await fetch(url.href)
		if (!res.ok) {
			setError(new Error("gagal mendapatkan link download film"))
			return
		}
		const m = await res.json()
		setMovies(m)
	}

	if (loading) {
		return (<li> Loading... </li>)
	}

	if (error) {
		return (<li> {error.message} </li>)
	}

	if (movies.length === 0) {
		return (<li> gagal mendapatkan link download film</li>)
	}

	return (
		<>
			{movies.map(i => {
				return <MovieCard movie={i} />
			})}
		</>
	)
}

function MovieCard({ movie }: { movie: Movie }) {
	const [less, setLess] = useState(true)
	const label = {}
	for (const downloadUrl of movie.downloadUrl) {
		const l = label[downloadUrl.label] ??= []
		l.push(downloadUrl)
	}
	return (
		<li class="flex flex-col m-2 p-2 rounded ring-1 ring-black h-max">
			<span class="capitalize text-blue-500">
				<a href={movie.siteUrl} target="_blank" rel="noreferrer">{movie.title}</a>
			</span>
			<span class="capitalize"> {movie.provider} </span>
			<button class="focus:outline-none" onClick={() => setLess(!less)}>{ less ? "view" : "hide"} download url </button>
			{!less && Object.entries(label).map(([l, downloadUrl]) => (
				<div class="">
					<span> {l} </span>
					<ul class="flex flex-row overflow-x-auto">
						{downloadUrl.map(i => (
							<li class="mx-1 px-2 py-1 bg-blue-400 text-white rounded w-max whitespace-nowrap">
								<a href={i.href} target="_blank" rel="noreferrer"> {i.server} </a>
							</li>
						))}
					</ul>
				</div>
			))}
		</li>
	)
}
