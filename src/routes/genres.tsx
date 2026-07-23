import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
    configurationOptions,
    movieGenresOptions,
    tvGenresOptions,
    useMovieGenres,
    useTvGenres,
} from "#/server/queries";

export const Route = createFileRoute("/genres")({
    component: GenresPage,
    loader: async ({ context }) => {
        await Promise.all([
            context.queryClient.ensureQueryData(configurationOptions()),
            context.queryClient.ensureQueryData(movieGenresOptions()),
            context.queryClient.ensureQueryData(tvGenresOptions()),
        ]);
    },
});

function GenreGroup({
    genres,
    mediaType,
    title,
}: {
    genres: { id: number; name: string }[];
    mediaType: "movie" | "tv";
    title: string;
}) {
    return (
        <section aria-labelledby={`${mediaType}-genres-heading`}>
            <h2
                className="mb-4 font-heading font-semibold text-2xl"
                id={`${mediaType}-genres-heading`}
            >
                {title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {genres.map((genre) => (
                    <Link
                        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4"
                        key={genre.id}
                        search={{
                            genreId: genre.id,
                            mediaType,
                            page: 1,
                            sortBy: "popularity.desc",
                        }}
                        to="/discover"
                    >
                        <Card className="transition-colors hover:bg-muted">
                            <CardHeader>
                                <CardTitle>{genre.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Badge variant="secondary">
                                    Discover{" "}
                                    {mediaType === "movie"
                                        ? "movies"
                                        : "TV shows"}
                                </Badge>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function GenresPage() {
    const { data: movieGenres } = useMovieGenres();
    const { data: tvGenres } = useTvGenres();

    return (
        <main className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
            <div>
                <Badge variant="secondary">Genres</Badge>
                <h1 className="mt-3 font-heading font-semibold text-3xl">
                    Browse by genre
                </h1>
                <p className="mt-3 text-muted-foreground">
                    Choose a genre to discover something new to watch.
                </p>
            </div>
            <GenreGroup
                genres={movieGenres.genres}
                mediaType="movie"
                title="Movie genres"
            />
            <GenreGroup
                genres={tvGenres.genres}
                mediaType="tv"
                title="TV genres"
            />
        </main>
    );
}
