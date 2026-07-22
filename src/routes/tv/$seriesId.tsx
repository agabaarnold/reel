import {
    IconArrowLeft,
    IconExternalLink,
    IconStarFilled,
} from "@tabler/icons-react";
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
import { ContentRow } from "#/features/home/components/content-row";
import { TvCard } from "#/features/home/components/media-cards";
import { releaseYear } from "#/lib/utils";
import { buildImageUrl } from "#/schema/configuration";
import type { TvDetails } from "#/schema/tv";
import {
    configurationOptions,
    tvDetailsOptions,
    useConfiguration,
    useTvDetails,
} from "#/server/queries";

const seriesParamsSchema = z.object({
    seriesId: z.coerce.number().int().positive(),
});

export const Route = createFileRoute("/tv/$seriesId")({
    component: TvDetailsPage,
    loader: async ({ context, params }) => {
        await Promise.all([
            context.queryClient.ensureQueryData(configurationOptions()),
            context.queryClient.ensureQueryData(
                tvDetailsOptions({ series_id: params.seriesId })
            ),
        ]);
    },
    params: seriesParamsSchema,
});

function SeriesMeta({ series }: { series: TvDetails }) {
    return (
        <div className="flex flex-wrap gap-2 text-muted-foreground text-sm">
            <Badge variant="secondary">{series.status}</Badge>
            <Badge variant="outline">
                {releaseYear(series.first_air_date)}
            </Badge>
            <Badge variant="outline">{series.number_of_seasons} seasons</Badge>
            <Badge variant="outline">
                {series.number_of_episodes} episodes
            </Badge>
            <Badge variant="outline">
                {series.original_language.toUpperCase()}
            </Badge>
        </div>
    );
}

function SeriesVideos({ series }: { series: TvDetails }) {
    const videos = series.videos?.results
        .filter((video) => video.site === "YouTube" || video.site === "Vimeo")
        .slice(0, 4);

    if (!videos?.length) {
        return null;
    }

    return (
        <section aria-labelledby="videos-heading">
            <h2
                className="mb-4 font-heading font-semibold text-2xl"
                id="videos-heading"
            >
                Videos
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
                {videos.map((video) => {
                    const url =
                        video.site === "YouTube"
                            ? `https://www.youtube.com/watch?v=${video.key}`
                            : `https://vimeo.com/${video.key}`;

                    return (
                        <a
                            className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4 text-sm transition-colors hover:bg-muted"
                            href={url}
                            key={video.id}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <span>
                                <span className="block font-medium">
                                    {video.name}
                                </span>
                                <span className="text-muted-foreground">
                                    {video.type}
                                </span>
                            </span>
                            <IconExternalLink
                                aria-hidden="true"
                                className="size-4 shrink-0"
                            />
                        </a>
                    );
                })}
            </div>
        </section>
    );
}

function TvDetailsPage() {
    const { seriesId } = Route.useParams();
    const { data: series } = useTvDetails({ series_id: seriesId });
    const { data: configuration } = useConfiguration();
    const backdropUrl = buildImageUrl(
        configuration.images,
        series.backdrop_path,
        "w1280"
    );
    const [regionProviders] = Object.values(
        series["watch/providers"]?.results ?? {}
    );
    const providers = [
        ...(regionProviders?.flatrate ?? []),
        ...(regionProviders?.free ?? []),
        ...(regionProviders?.rent ?? []),
        ...(regionProviders?.buy ?? []),
    ];

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
                to="/"
            >
                <IconArrowLeft aria-hidden="true" className="size-4" />
                Back to home
            </Link>

            <Card className="relative mt-6 overflow-hidden md:flex-row">
                {backdropUrl ? (
                    <img
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover opacity-15"
                        height={720}
                        src={backdropUrl}
                        width={1280}
                    />
                ) : null}
                <div className="relative shrink-0 md:w-72">
                    <PosterImage
                        alt={`Poster for ${series.name}`}
                        className="rounded-none md:rounded-l-xl"
                        path={series.poster_path}
                    />
                </div>
                <div className="relative flex flex-1 flex-col justify-center">
                    <CardHeader className="gap-3">
                        <SeriesMeta series={series} />
                        <CardTitle className="text-3xl sm:text-4xl">
                            {series.name}
                        </CardTitle>
                        {series.tagline ? (
                            <CardDescription className="text-base italic">
                                {series.tagline}
                            </CardDescription>
                        ) : null}
                        <CardDescription className="flex items-center gap-1">
                            <IconStarFilled
                                aria-hidden="true"
                                className="size-4 text-amber-500"
                            />
                            {series.vote_average.toFixed(1)} from{" "}
                            {series.vote_count} ratings
                        </CardDescription>
                        <div className="flex flex-wrap gap-2">
                            {series.genres.map((genre) => (
                                <Badge key={genre.id} variant="outline">
                                    {genre.name}
                                </Badge>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">
                            {series.overview ||
                                "No overview is available for this TV series."}
                        </p>
                        {series.homepage ? (
                            <a
                                className="mt-4 inline-flex items-center gap-2 text-primary text-sm hover:underline"
                                href={series.homepage}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Official website
                                <IconExternalLink
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </a>
                        ) : null}
                    </CardContent>
                </div>
            </Card>

            {series.credits?.cast.length ? (
                <section aria-labelledby="cast-heading" className="mt-12">
                    <h2
                        className="mb-4 font-heading font-semibold text-2xl"
                        id="cast-heading"
                    >
                        Cast
                    </h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                        {series.credits.cast.slice(0, 8).map((person) => (
                            <Link
                                className="group text-center"
                                key={person.credit_id}
                                params={{ personId: person.id }}
                                to="/person/$personId"
                            >
                                <PosterImage
                                    alt={`Profile of ${person.name}`}
                                    className="transition-transform group-hover:scale-[1.02]"
                                    path={person.profile_path}
                                    variant="profile"
                                />
                                <p className="mt-2 truncate font-medium text-sm">
                                    {person.name}
                                </p>
                                <p className="truncate text-muted-foreground text-xs">
                                    {person.character}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            ) : null}

            {series.seasons.length ? (
                <section aria-labelledby="seasons-heading" className="mt-12">
                    <h2
                        className="mb-4 font-heading font-semibold text-2xl"
                        id="seasons-heading"
                    >
                        Seasons
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {series.seasons.map((season) => (
                            <Card
                                className="flex-row overflow-hidden py-0"
                                key={season.id}
                            >
                                <PosterImage
                                    alt={`Poster for ${season.name}`}
                                    className="h-32 w-24 rounded-none object-cover"
                                    path={season.poster_path}
                                />
                                <CardContent className="p-4">
                                    <CardTitle>{season.name}</CardTitle>
                                    <CardDescription className="mt-1">
                                        {season.episode_count} episodes
                                    </CardDescription>
                                    <p className="mt-2 line-clamp-2 text-muted-foreground text-xs">
                                        {season.overview ||
                                            "No overview available."}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            ) : null}

            {providers.length ? (
                <section
                    aria-labelledby="where-to-watch-heading"
                    className="mt-12"
                >
                    <h2
                        className="mb-4 font-heading font-semibold text-2xl"
                        id="where-to-watch-heading"
                    >
                        Where to watch
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {providers.map((provider) => (
                            <Badge
                                key={provider.provider_id}
                                variant="secondary"
                            >
                                {provider.provider_name}
                            </Badge>
                        ))}
                    </div>
                </section>
            ) : null}

            <div className="mt-12">
                <SeriesVideos series={series} />
            </div>

            {series.recommendations?.results.length ? (
                <div className="mt-12">
                    <ContentRow
                        id="tv-recommendations"
                        title="You may also like"
                    >
                        {series.recommendations.results
                            .slice(0, 12)
                            .map((recommendation) => (
                                <TvCard
                                    key={recommendation.id}
                                    series={recommendation}
                                />
                            ))}
                    </ContentRow>
                </div>
            ) : null}
        </main>
    );
}
