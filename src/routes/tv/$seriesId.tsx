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
    const providerRegions = series["watch/providers"]?.results ?? {};
    const regionProviders =
        providerRegions.US ?? Object.values(providerRegions)[0];
    const providers = Array.from(
        new Map(
            [
                ...(regionProviders?.flatrate ?? []),
                ...(regionProviders?.free ?? []),
                ...(regionProviders?.rent ?? []),
                ...(regionProviders?.buy ?? []),
            ].map((provider) => [provider.provider_id, provider])
        ).values()
    );

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
                to="/"
            >
                <IconArrowLeft aria-hidden="true" className="size-4" />
                Back to home
            </Link>

            <section
                aria-labelledby="series-title"
                className="relative mt-6 min-h-[34rem] overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10"
            >
                {backdropUrl ? (
                    <img
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-cover"
                        height={720}
                        src={backdropUrl}
                        width={1280}
                    />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-background/20" />

                <div className="relative flex min-h-[34rem] flex-col justify-end gap-8 p-6 sm:p-10 md:flex-row md:items-end md:justify-start md:gap-10 lg:p-14">
                    <div className="w-40 shrink-0 sm:w-52 md:w-64">
                        <PosterImage
                            alt={`Poster for ${series.name}`}
                            className="shadow-2xl"
                            path={series.poster_path}
                        />
                    </div>
                    <div className="max-w-3xl pb-1">
                        <Badge className="mb-4" variant="secondary">
                            TV series
                        </Badge>
                        <SeriesMeta series={series} />
                        <h1
                            className="mt-4 font-heading font-semibold text-4xl tracking-tight sm:text-5xl lg:text-6xl"
                            id="series-title"
                        >
                            {series.name}
                        </h1>
                        {series.tagline ? (
                            <p className="mt-3 text-lg text-muted-foreground italic">
                                {series.tagline}
                            </p>
                        ) : null}
                        <p className="mt-4 flex items-center gap-1 text-muted-foreground text-sm">
                            <IconStarFilled
                                aria-hidden="true"
                                className="size-4 text-amber-500"
                            />
                            {series.vote_average.toFixed(1)} from{" "}
                            {series.vote_count} ratings
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {series.genres.map((genre) => (
                                <Badge key={genre.id} variant="outline">
                                    {genre.name}
                                </Badge>
                            ))}
                        </div>
                        <p className="mt-6 max-w-2xl text-muted-foreground leading-7">
                            {series.overview ||
                                "No overview is available for this TV series."}
                        </p>
                        {series.homepage ? (
                            <a
                                className="mt-5 inline-flex items-center gap-2 text-primary text-sm hover:underline"
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
                    </div>
                </div>
            </section>

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
                            <Link
                                className="block"
                                key={season.id}
                                params={{
                                    seasonNumber: season.season_number,
                                    seriesId: series.id,
                                }}
                                to="/tv/$seriesId/season/$seasonNumber"
                            >
                                <Card className="flex-row overflow-hidden py-0 transition-colors hover:bg-muted">
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
                            </Link>
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
