import { Skeleton } from "#/components/ui/skeleton";
import { MovieCard } from "#/features/home/components/media-cards";
import type { TrendingItem } from "#/schema/trending";
import { useTrending } from "#/server/queries";

function isTrendingMovie(
    item: TrendingItem
): item is Extract<TrendingItem, { media_type: "movie" }> {
    return item.media_type === "movie";
}

export const TrendingSection = () => {
    const { data } = useTrending({
        media_type: "movie",
        time_window: "week",
    });
    const movies = data.results.filter(isTrendingMovie);

    return (
        <section className="mb-10">
            <h2 className="mb-3 font-semibold text-lg">Trending this week</h2>

            <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} width="w-36" />
                ))}
            </div>
        </section>
    );
};

export function TrendingCardSkeleton({ width = "w-36" }: { width?: string }) {
    return (
        <div className={width}>
            <Skeleton className="aspect-2/3 w-full rounded-lg" />
            <Skeleton className="mt-2 h-4 w-3/4 rounded" />
            <Skeleton className="mt-1 h-3 w-1/2 rounded" />
        </div>
    );
}
