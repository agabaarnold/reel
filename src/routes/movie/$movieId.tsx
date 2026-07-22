import { IconArrowLeft, IconStarFilled } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import PosterImage from "#/components/shared/poster-image";
import { Badge } from "#/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";
import { releaseYear } from "#/lib/utils";
import {
    configurationOptions,
    movieDetailsOptions,
    useMovieDetails,
} from "#/server/queries";

const movieParamsSchema = z.object({
    movieId: z.coerce.number().int().positive(),
});

export const Route = createFileRoute("/movie/$movieId")({
    component: MovieDetailsPage,
    loader: async ({ context, params }) => {
        await Promise.all([
            context.queryClient.ensureQueryData(configurationOptions()),
            context.queryClient.ensureQueryData(
                movieDetailsOptions({ movie_id: params.movieId })
            ),
        ]);
    },
    params: movieParamsSchema,
});

function MovieDetailsPage() {
    const { movieId } = Route.useParams();
    const { data: movie } = useMovieDetails({ movie_id: movieId });

    return (
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
                className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
                to="/"
            >
                <IconArrowLeft aria-hidden="true" className="size-4" />
                Back to home
            </Link>

            <Card className="mt-6 md:flex-row">
                <div className="shrink-0 md:w-72">
                    <PosterImage
                        alt={`Poster for ${movie.title}`}
                        className="rounded-none md:rounded-l-xl"
                        path={movie.poster_path}
                    />
                </div>
                <div className="flex flex-1 flex-col">
                    <CardHeader>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Movie</Badge>
                            <Badge variant="outline">
                                {releaseYear(movie.release_date)}
                            </Badge>
                        </div>
                        <CardTitle className="text-3xl">
                            {movie.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                            <IconStarFilled
                                aria-hidden="true"
                                className="size-4 text-amber-500"
                            />
                            {movie.vote_average.toFixed(1)} from{" "}
                            {movie.vote_count} ratings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">
                            {movie.overview ||
                                "No overview is available for this movie."}
                        </p>
                    </CardContent>
                </div>
            </Card>
        </main>
    );
}
