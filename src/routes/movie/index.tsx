import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import FeaturedCarousel from "#/components/shared/featured-carousel";
import { ContentRow } from "#/features/home/components/content-row";
import { MovieCard } from "#/features/home/components/media-cards";
import {
    configurationOptions,
    nowPlayingMoviesOptions,
    popularMoviesOptions,
    topRatedMoviesOptions,
    trendingOptions,
    upcomingMoviesOptions,
    useNowPlayingMovies,
    usePopularMovies,
    useTopRatedMovies,
    useTrending,
    useUpcomingMovies,
} from "#/server/queries";

const movieSearchSchema = z.object({
    page: z.number().int().positive().default(1).catch(1),
    timeWindow: z.enum(["day", "week"]).default("week").catch("week"),
});

// biome-ignore assist/source/useSortedKeys: Thats the expected order
export const Route = createFileRoute("/movie/")({
    component: MoviesPage,
    loaderDeps: ({ search }) => search,
    loader: async ({ context, deps }) => {
        const { queryClient } = context;
        await Promise.all([
            queryClient.prefetchQuery(configurationOptions()),
            queryClient.prefetchQuery(
                trendingOptions({
                    media_type: "movie",
                    page: deps.page,
                    time_window: deps.timeWindow,
                })
            ),
            queryClient.prefetchQuery(nowPlayingMoviesOptions()),
            queryClient.prefetchQuery(popularMoviesOptions()),
            queryClient.prefetchQuery(topRatedMoviesOptions()),
            queryClient.prefetchQuery(upcomingMoviesOptions()),
        ]);
    },
    validateSearch: movieSearchSchema,
});

function MoviesPage() {
    const { page, timeWindow } = Route.useLoaderDeps();
    const { data } = useTrending({
        media_type: "movie",
        page,
        time_window: timeWindow,
    });
    const { data: nowPlaying } = useNowPlayingMovies();
    const { data: popularMovies } = usePopularMovies();
    const { data: topRatedMovies } = useTopRatedMovies();
    const { data: upcomingMovies } = useUpcomingMovies();

    const trending = data.results;

    return (
        <main className="pb-16">
            <FeaturedCarousel media={trending} />

            <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 sm:px-6 lg:px-8">
                <ContentRow id="now-playing" title="Now Playing">
                    {nowPlaying.results.slice(0, 12).map((movie) => (
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
            </div>
        </main>
    );
}
