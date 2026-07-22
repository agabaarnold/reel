import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import FeaturedCarousel from "#/components/shared/featured-carousel";
import { ContentRow } from "#/features/home/components/content-row";
import { MovieCard, TvCard } from "#/features/home/components/media-cards";
import {
    airingTodayTvOptions,
    configurationOptions,
    nowPlayingMoviesOptions,
    onTheAirTvOptions,
    popularMoviesOptions,
    popularTvOptions,
    topRatedMoviesOptions,
    topRatedTvOptions,
    trendingOptions,
    upcomingMoviesOptions,
    useAiringTodayTv,
    useNowPlayingMovies,
    useOnTheAirTv,
    usePopularMovies,
    usePopularTv,
    useTopRatedMovies,
    useTopRatedTv,
    useTrending,
    useUpcomingMovies,
} from "#/server/queries";

const homeSearchSchema = z.object({
    page: z.number().int().positive().default(1),
    timeWindow: z.enum(["day", "week"]).default("day"),
});

// biome-ignore assist/source/useSortedKeys: Thats the expected order
export const Route = createFileRoute("/")({
    component: Home,
    loaderDeps: ({ search }) => search,
    loader: async ({ context, deps }) => {
        const { queryClient } = context;
        await Promise.all([
            queryClient.prefetchQuery(configurationOptions()),
            queryClient.prefetchQuery(
                trendingOptions({
                    media_type: "all",
                    page: deps.page,
                    time_window: deps.timeWindow,
                })
            ),
            queryClient.prefetchQuery(nowPlayingMoviesOptions()),
            queryClient.prefetchQuery(popularMoviesOptions()),
            queryClient.prefetchQuery(topRatedMoviesOptions()),
            queryClient.prefetchQuery(upcomingMoviesOptions()),
            queryClient.prefetchQuery(airingTodayTvOptions()),
            queryClient.prefetchQuery(onTheAirTvOptions()),
            queryClient.prefetchQuery(popularTvOptions()),
            queryClient.prefetchQuery(topRatedTvOptions()),
        ]);
    },
    validateSearch: homeSearchSchema,
});

function Home() {
    const { page, timeWindow } = Route.useLoaderDeps();
    const { data, isLoading, isError } = useTrending({
        media_type: "all",
        page,
        time_window: timeWindow,
    });
    const { data: trendingMovies } = useNowPlayingMovies();
    const { data: popularMovies } = usePopularMovies();
    const { data: topRatedMovies } = useTopRatedMovies();
    const { data: upcomingMovies } = useUpcomingMovies();
    const { data: airingToday } = useAiringTodayTv();
    const { data: onTheAir } = useOnTheAirTv();
    const { data: popularTv } = usePopularTv();
    const { data: topRatedTv } = useTopRatedTv();

    const trending = data.results;

    return (
        <main className="pb-16">
            <FeaturedCarousel
                isError={isError}
                isLoading={isLoading}
                media={trending}
            />

            <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
                <ContentRow id="now-playing" title="Now Playing">
                    {trendingMovies.results.slice(0, 12).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </ContentRow>

                <ContentRow id="popular-movies" title="Popular Movies">
                    {popularMovies.results.slice(0, 12).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </ContentRow>

                <ContentRow id="top-rated-movies" title="Top Rated Movies">
                    {topRatedMovies.results.slice(0, 12).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </ContentRow>

                <ContentRow id="upcoming-movies" title="Upcoming Movies">
                    {upcomingMovies.results.slice(0, 12).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </ContentRow>

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
