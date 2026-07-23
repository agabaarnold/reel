import {
    IconArrowLeft,
    IconArrowRight,
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
import { releaseYear } from "#/lib/utils";
import { buildImageUrl } from "#/schema/configuration";
import {
    configurationOptions,
    tvDetailsOptions,
    tvSeasonDetailsOptions,
    useConfiguration,
    useTvDetails,
    useTvSeasonDetails,
} from "#/server/queries";

const seasonParamsSchema = z.object({
    seasonNumber: z.coerce.number().int().min(0),
    seriesId: z.coerce.number().int().positive(),
});

export const Route = createFileRoute("/tv/$seriesId/season/$seasonNumber")({
    component: SeasonDetailsPage,
    loader: async ({ context, params }) => {
        await Promise.all([
            context.queryClient.ensureQueryData(configurationOptions()),
            context.queryClient.ensureQueryData(
                tvDetailsOptions({ series_id: params.seriesId })
            ),
            context.queryClient.ensureQueryData(
                tvSeasonDetailsOptions({
                    season_number: params.seasonNumber,
                    series_id: params.seriesId,
                })
            ),
        ]);
    },
    params: seasonParamsSchema,
});

function SeasonDetailsPage() {
    const { seasonNumber, seriesId } = Route.useParams();
    const { data: season } = useTvSeasonDetails({
        season_number: seasonNumber,
        series_id: seriesId,
    });
    const { data: series } = useTvDetails({ series_id: seriesId });
    const { data: configuration } = useConfiguration();
    const nextSeasonNumber = seasonNumber + 1;
    const hasNextSeason = series.seasons.some(
        (seriesSeason) => seriesSeason.season_number === nextSeasonNumber
    );

    return (
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
                className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
                params={{ seriesId }}
                to="/tv/$seriesId"
            >
                <IconArrowLeft aria-hidden="true" className="size-4" />
                Back to series
            </Link>

            <section className="mt-6 flex flex-col gap-6 sm:flex-row">
                <div className="shrink-0 sm:w-56">
                    <PosterImage
                        alt={`Poster for ${season.name}`}
                        path={season.poster_path}
                    />
                </div>
                <div>
                    <p className="font-medium text-muted-foreground text-sm uppercase tracking-wider">
                        TV series · season details
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                            Season {season.season_number}
                        </Badge>
                        {season.air_date ? (
                            <Badge variant="outline">
                                {releaseYear(season.air_date)}
                            </Badge>
                        ) : null}
                        <Badge variant="outline">
                            {season.episodes.length} episodes
                        </Badge>
                    </div>
                    <h1 className="mt-3 font-heading font-semibold text-3xl">
                        {season.name}
                    </h1>
                    <p className="mt-4 text-muted-foreground leading-7">
                        {season.overview ||
                            "No overview is available for this season."}
                    </p>
                    {hasNextSeason ? (
                        <Link
                            className="mt-6 inline-flex items-center gap-2 font-medium text-primary text-sm hover:underline"
                            params={{
                                seasonNumber: nextSeasonNumber,
                                seriesId,
                            }}
                            to="/tv/$seriesId/season/$seasonNumber"
                        >
                            Next season: Season {nextSeasonNumber}
                            <IconArrowRight
                                aria-hidden="true"
                                className="size-4"
                            />
                        </Link>
                    ) : null}
                </div>
            </section>

            <section aria-labelledby="episodes-heading" className="mt-12">
                <h2
                    className="mb-4 font-heading font-semibold text-2xl"
                    id="episodes-heading"
                >
                    Episodes
                </h2>
                <div className="flex flex-col gap-4">
                    {season.episodes.map((episode) => (
                        <Card
                            className="flex-row overflow-hidden py-0"
                            key={episode.id}
                        >
                            {episode.still_path ? (
                                <img
                                    alt={`Still from episode ${episode.episode_number}: ${episode.name}`}
                                    className="hidden h-32 w-48 object-cover sm:block"
                                    height={281}
                                    src={
                                        buildImageUrl(
                                            configuration.images,
                                            episode.still_path,
                                            "w300"
                                        ) ?? undefined
                                    }
                                    width={500}
                                />
                            ) : null}
                            <CardContent className="flex-1 p-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <CardTitle>
                                        {episode.episode_number}. {episode.name}
                                    </CardTitle>
                                    {episode.air_date ? (
                                        <CardDescription>
                                            {episode.air_date}
                                        </CardDescription>
                                    ) : null}
                                </div>
                                <p className="mt-2 text-muted-foreground text-sm">
                                    {episode.overview ||
                                        "No overview is available for this episode."}
                                </p>
                                <p className="mt-3 flex items-center gap-1 text-muted-foreground text-xs">
                                    <IconStarFilled
                                        aria-hidden="true"
                                        className="size-3 text-amber-500"
                                    />
                                    {episode.vote_average.toFixed(1)} (
                                    {episode.vote_count} ratings)
                                    {episode.runtime
                                        ? ` · ${episode.runtime} min`
                                        : ""}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </main>
    );
}
