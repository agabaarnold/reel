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
    tvDetailsOptions,
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

function TvDetailsPage() {
    const { seriesId } = Route.useParams();
    const { data: series } = useTvDetails({ series_id: seriesId });

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
                        alt={`Poster for ${series.name}`}
                        className="rounded-none md:rounded-l-xl"
                        path={series.poster_path}
                    />
                </div>
                <div className="flex flex-1 flex-col">
                    <CardHeader>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">TV series</Badge>
                            <Badge variant="outline">
                                {releaseYear(series.first_air_date)}
                            </Badge>
                        </div>
                        <CardTitle className="text-3xl">
                            {series.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                            <IconStarFilled
                                aria-hidden="true"
                                className="size-4 text-amber-500"
                            />
                            {series.vote_average.toFixed(1)} from{" "}
                            {series.vote_count} ratings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">
                            {series.overview ||
                                "No overview is available for this TV series."}
                        </p>
                    </CardContent>
                </div>
            </Card>
        </main>
    );
}
