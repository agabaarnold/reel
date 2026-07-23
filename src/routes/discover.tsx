import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { z } from "zod";
import { Badge } from "#/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "#/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";
import { MovieCard, TvCard } from "#/features/home/components/media-cards";
import type { Genre } from "#/schema/common";
import type { DiscoverMovieParams, DiscoverTvParams } from "#/schema/discover";
import {
    configurationOptions,
    discoverMoviesOptions,
    discoverTvOptions,
    movieGenresOptions,
    tvGenresOptions,
    useDiscoverMovies,
    useDiscoverTv,
    useMovieGenres,
    useTvGenres,
} from "#/server/queries";

const discoverSearchSchema = z.object({
    genreId: z.coerce.number().int().positive().optional(),
    mediaType: z.enum(["movie", "tv"]).default("movie").catch("movie"),
    page: z.number().int().positive().default(1).catch(1),
    sortBy: z
        .enum([
            "popularity.desc",
            "vote_average.desc",
            "vote_average.asc",
            "date.desc",
        ])
        .default("popularity.desc")
        .catch("popularity.desc"),
});

function resolveDiscoverSort(mediaType: "movie" | "tv", sortBy: string) {
    if (sortBy !== "date.desc") {
        return sortBy;
    }
    if (mediaType === "movie") {
        return "release_date.desc";
    }
    return "first_air_date.desc";
}

export const Route = createFileRoute("/discover")({
    component: DiscoverPage,
    loader: async ({ context, deps }) => {
        const genreOptions =
            deps.mediaType === "movie"
                ? movieGenresOptions()
                : tvGenresOptions();
        const params = {
            page: deps.page,
            sort_by: resolveDiscoverSort(deps.mediaType, deps.sortBy),
            ...(deps.genreId ? { with_genres: String(deps.genreId) } : {}),
        };

        await Promise.all([
            context.queryClient.ensureQueryData(configurationOptions()),
            context.queryClient.ensureQueryData(genreOptions),
            deps.mediaType === "movie"
                ? context.queryClient.ensureQueryData(
                      discoverMoviesOptions(params)
                  )
                : context.queryClient.ensureQueryData(
                      discoverTvOptions(params)
                  ),
        ]);
    },
    loaderDeps: ({ search }) => search,
    validateSearch: discoverSearchSchema,
});

function DiscoverControls({
    genres,
    genreId,
    mediaType,
    sortBy,
}: {
    genres: Genre[];
    genreId?: number;
    mediaType: "movie" | "tv";
    sortBy: string;
}) {
    const navigate = useNavigate({ from: "/discover" });

    const updateSearch = useCallback(
        async (changes: {
            genreId?: number;
            mediaType?: "movie" | "tv";
            sortBy?: string;
        }) => {
            await navigate({
                search: (previous) => ({
                    ...previous,
                    ...changes,
                    page: 1,
                }),
                to: "/discover",
            });
        },
        [navigate]
    );
    const handleMediaTypeChange = useCallback(
        async (key: string | number) => {
            await updateSearch({
                genreId: undefined,
                mediaType: String(key) as "movie" | "tv",
            });
        },
        [updateSearch]
    );
    const handleGenreChange = useCallback(
        async (key: string | number) => {
            await updateSearch({
                genreId: key === "all" ? undefined : Number(key),
            });
        },
        [updateSearch]
    );
    const handleSortChange = useCallback(
        async (key: string | number) => {
            await updateSearch({ sortBy: String(key) });
        },
        [updateSearch]
    );

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Select
                aria-label="Media type"
                onSelectionChange={handleMediaTypeChange}
                selectedKey={mediaType}
            >
                <SelectTrigger className="w-full sm:w-36">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem id="movie">Movies</SelectItem>
                    <SelectItem id="tv">TV shows</SelectItem>
                </SelectContent>
            </Select>

            <Select
                aria-label="Genre"
                onSelectionChange={handleGenreChange}
                selectedKey={genreId ? String(genreId) : "all"}
            >
                <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem id="all">All genres</SelectItem>
                    {genres.map((genre) => (
                        <SelectItem id={String(genre.id)} key={genre.id}>
                            {genre.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                aria-label="Sort results"
                onSelectionChange={handleSortChange}
                selectedKey={sortBy}
            >
                <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem id="popularity.desc">Most popular</SelectItem>
                    <SelectItem id="vote_average.desc">
                        Highest rated
                    </SelectItem>
                    <SelectItem id="vote_average.asc">Lowest rated</SelectItem>
                    <SelectItem id="date.desc">Newest</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

function buildDiscoverParams(
    genreId: number | undefined,
    mediaType: "movie" | "tv",
    page: number,
    sortBy: string
) {
    return {
        page,
        sort_by: resolveDiscoverSort(mediaType, sortBy),
        ...(genreId ? { with_genres: String(genreId) } : {}),
    };
}

function MovieDiscoverResults({
    genreId,
    page,
    sortBy,
}: Omit<DiscoverResultsProps, "mediaType">) {
    const params = buildDiscoverParams(
        genreId,
        "movie",
        page,
        sortBy
    ) as DiscoverMovieParams;
    const { data } = useDiscoverMovies(params);

    return (
        <>
            {data.results.length ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                    {data.results.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">
                    No movies matched these filters.
                </p>
            )}

            {data.total_pages > 1 ? (
                <DiscoverPagination
                    genreId={genreId}
                    mediaType="movie"
                    page={page}
                    sortBy={sortBy}
                    totalPages={data.total_pages}
                />
            ) : null}
        </>
    );
}

function TvDiscoverResults({
    genreId,
    page,
    sortBy,
}: Omit<DiscoverResultsProps, "mediaType">) {
    const params = buildDiscoverParams(
        genreId,
        "tv",
        page,
        sortBy
    ) as DiscoverTvParams;
    const { data } = useDiscoverTv(params);

    return (
        <>
            {data.results.length ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                    {data.results.map((series) => (
                        <TvCard key={series.id} series={series} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">
                    No TV shows matched these filters.
                </p>
            )}

            {data.total_pages > 1 ? (
                <DiscoverPagination
                    genreId={genreId}
                    mediaType="tv"
                    page={page}
                    sortBy={sortBy}
                    totalPages={data.total_pages}
                />
            ) : null}
        </>
    );
}

interface DiscoverResultsProps {
    genreId?: number;
    mediaType: "movie" | "tv";
    page: number;
    sortBy: string;
}

function DiscoverResults(props: DiscoverResultsProps) {
    return props.mediaType === "movie" ? (
        <MovieDiscoverResults {...props} />
    ) : (
        <TvDiscoverResults {...props} />
    );
}

function DiscoverPagination({
    genreId,
    mediaType,
    page,
    sortBy,
    totalPages,
}: {
    genreId?: number;
    mediaType: "movie" | "tv";
    page: number;
    sortBy: string;
    totalPages: number;
}) {
    const previousPage = page > 1 ? page - 1 : undefined;
    const nextPage = page < totalPages ? page + 1 : undefined;

    return (
        <Pagination className="mt-12">
            <PaginationContent>
                {previousPage ? (
                    <PaginationItem>
                        <PaginationPrevious
                            search={{
                                genreId,
                                mediaType,
                                page: previousPage,
                                sortBy,
                            }}
                            to="/discover"
                        />
                    </PaginationItem>
                ) : null}
                {nextPage ? (
                    <PaginationItem>
                        <PaginationNext
                            search={{
                                genreId,
                                mediaType,
                                page: nextPage,
                                sortBy,
                            }}
                            to="/discover"
                        />
                    </PaginationItem>
                ) : null}
            </PaginationContent>
        </Pagination>
    );
}

function DiscoverPage() {
    const { genreId, mediaType, page, sortBy } = Route.useSearch();

    return mediaType === "movie" ? (
        <MovieDiscoverPage genreId={genreId} page={page} sortBy={sortBy} />
    ) : (
        <TvDiscoverPage genreId={genreId} page={page} sortBy={sortBy} />
    );
}

function MovieDiscoverPage({
    genreId,
    page,
    sortBy,
}: Omit<DiscoverResultsProps, "mediaType">) {
    const { data } = useMovieGenres();
    return (
        <DiscoverLayout
            genreId={genreId}
            genres={data.genres}
            mediaType="movie"
            page={page}
            sortBy={sortBy}
        />
    );
}

function TvDiscoverPage({
    genreId,
    page,
    sortBy,
}: Omit<DiscoverResultsProps, "mediaType">) {
    const { data } = useTvGenres();
    return (
        <DiscoverLayout
            genreId={genreId}
            genres={data.genres}
            mediaType="tv"
            page={page}
            sortBy={sortBy}
        />
    );
}

function DiscoverLayout({
    genres,
    genreId,
    mediaType,
    page,
    sortBy,
}: DiscoverResultsProps & { genres: Genre[] }) {
    const selectedGenre = genres.find((genre) => genre.id === genreId);
    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Badge variant="secondary">Discover</Badge>
                    <h1 className="mt-3 font-heading font-semibold text-3xl">
                        {selectedGenre?.name ?? "Find something to watch"}
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                        Browse {mediaType === "movie" ? "movies" : "TV shows"}{" "}
                        by genre and sort.
                    </p>
                </div>
                <Link
                    className="text-primary text-sm hover:underline"
                    to="/genres"
                >
                    Browse all genres
                </Link>
            </div>

            <div className="mt-8">
                <DiscoverControls
                    genreId={genreId}
                    genres={genres}
                    mediaType={mediaType}
                    sortBy={sortBy}
                />
            </div>

            <div className="mt-10">
                <DiscoverResults
                    genreId={genreId}
                    mediaType={mediaType}
                    page={page}
                    sortBy={sortBy}
                />
            </div>
        </main>
    );
}
