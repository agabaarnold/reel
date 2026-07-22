import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import FeaturedCarousel from "#/components/shared/featured-carousel";
import { ContentRow } from "#/features/home/components/content-row";
import { TvCard } from "#/features/home/components/media-cards";
import {
    airingTodayTvOptions,
    configurationOptions,
    onTheAirTvOptions,
    popularTvOptions,
    topRatedTvOptions,
    trendingOptions,
    useAiringTodayTv,
    useOnTheAirTv,
    usePopularTv,
    useTopRatedTv,
    useTrending,
} from "#/server/queries";

const tvSearchSchema = z.object({
    page: z.number().int().positive().default(1).catch(1),
    timeWindow: z.enum(["day", "week"]).default("week").catch("week"),
});

// biome-ignore assist/source/useSortedKeys: Thats the expected order
export const Route = createFileRoute("/tv/")({
    component: TVShowsPage,
    loaderDeps: ({ search }) => search,
    loader: async ({ context, deps }) => {
        const { queryClient } = context;
        await Promise.all([
            queryClient.prefetchQuery(configurationOptions()),
            queryClient.prefetchQuery(
                trendingOptions({
                    media_type: "tv",
                    page: deps.page,
                    time_window: deps.timeWindow,
                })
            ),
            queryClient.prefetchQuery(airingTodayTvOptions()),
            queryClient.prefetchQuery(onTheAirTvOptions()),
            queryClient.prefetchQuery(popularTvOptions()),
            queryClient.prefetchQuery(topRatedTvOptions()),
        ]);
    },
    validateSearch: tvSearchSchema,
});

function TVShowsPage() {
    const { page, timeWindow } = Route.useLoaderDeps();
    const { data } = useTrending({
        media_type: "tv",
        page,
        time_window: timeWindow,
    });
    const { data: airingToday } = useAiringTodayTv();
    const { data: onTheAir } = useOnTheAirTv();
    const { data: popularTv } = usePopularTv();
    const { data: topRatedTv } = useTopRatedTv();

    const trending = data.results;

    return (
        <main className="pb-16">
            <FeaturedCarousel media={trending} />

            <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
                <ContentRow id="airing-today" title="Airing Today">
                    {airingToday.results.slice(0, 12).map((series) => (
                        <TvCard key={series.id} series={series} />
                    ))}
                </ContentRow>

                <ContentRow id="on-the-air" title="On The Air">
                    {onTheAir.results.slice(0, 12).map((series) => (
                        <TvCard key={series.id} series={series} />
                    ))}
                </ContentRow>

                <ContentRow id="popular-series" title="Popular Series">
                    {popularTv.results.slice(0, 12).map((series) => (
                        <TvCard key={series.id} series={series} />
                    ))}
                </ContentRow>

                <ContentRow id="top-rated-series" title="Top Rated Series">
                    {topRatedTv.results.slice(0, 12).map((series) => (
                        <TvCard key={series.id} series={series} />
                    ))}
                </ContentRow>
            </div>
        </main>
    );
}
