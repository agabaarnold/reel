import { useDiscoverMovies } from "#/server/queries";
import MovieCard from "./movie-card";
import { TrendingCardSkeleton } from "./trending-section";

const POPULAR_GRID_COUNT = 10;

const PopularSection = () => {
    const { data, isError, isLoading } = useDiscoverMovies({
        sort_by: "popularity.desc",
    });

    const movies = data?.results.slice(0, POPULAR_GRID_COUNT) ?? [];

    return (
        <section>
            <h2 className="mb-3 font-semibold text-lg">Popular right now</h2>

            {isError ? (
                <p className="text-muted-foreground text-sm">
                    Couldn't load popular titles right now.
                </p>
            ) : null}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                {isLoading
                    ? Array.from({ length: POPULAR_GRID_COUNT }).map(
                          (_, index) => (
                              <TrendingCardSkeleton
                                  // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                                  key={index}
                                  width="w-full"
                              />
                          )
                      )
                    : movies.map((movie) => (
                          <MovieCard
                              key={movie.id}
                              movie={movie}
                              width="w-full"
                          />
                      ))}
            </div>
        </section>
    );
};

export default PopularSection;
