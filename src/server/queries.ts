import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { DiscoverMovieParams, DiscoverTvParams } from "#/schema/discover";
import type { MovieDetailsParams, MovieListParams } from "#/schema/movies";
import type { SearchParams } from "#/schema/search";
import type { TrendingParams } from "#/schema/trending";
import type { TvDetailsParams, TvListParams } from "#/schema/tv";
import {
    discoverMoviesFn,
    discoverTvFn,
    getAiringTodayTvFn,
    getConfigurationFn,
    getMovieDetailsFn,
    getNowPlayingMoviesFn,
    getOnTheAirTvFn,
    getPersonCreditsFn,
    getPersonDetailsFn,
    getPopularMoviesFn,
    getPopularTvFn,
    getTopRatedMoviesFn,
    getTopRatedTvFn,
    getTrendingFn,
    getTvDetailsFn,
    getUpcomingMoviesFn,
    searchMultiFn,
} from "./tmdb-server";

/**
 * Each queryFn calls a server function that proxies to TMDB, so the
 * TMDB bearer token never reaches the browser bundle. Responses are
 * validated against the same Zod schemas used server-side.
 *
 * queryOptions() (TanStack Query v5) lets you reuse the same options
 * object for useSuspenseQuery, prefetchQuery, and ensureQueryData.
 */

export const tmdbKeys = {
    all: ["tmdb"] as const,
    configuration: () => [...tmdbKeys.all, "configuration"] as const,
    discoverMovies: (params: DiscoverMovieParams) =>
        [...tmdbKeys.all, "discover-movie", params] as const,
    discoverTv: (params: DiscoverTvParams) =>
        [...tmdbKeys.all, "discover-tv", params] as const,
    movie: (params: MovieDetailsParams) =>
        [...tmdbKeys.all, "movie", params] as const,
    movieList: (
        category: "now-playing" | "popular" | "top-rated" | "upcoming",
        params: MovieListParams
    ) => [...tmdbKeys.all, "movie-list", category, params] as const,
    person: (id: number) => [...tmdbKeys.all, "person", id] as const,
    personCredits: (id: number) =>
        [...tmdbKeys.all, "person-credits", id] as const,
    search: (params: SearchParams) =>
        [...tmdbKeys.all, "search", params] as const,
    trending: (params: TrendingParams) =>
        [...tmdbKeys.all, "trending", params] as const,
    tv: (params: TvDetailsParams) => [...tmdbKeys.all, "tv", params] as const,
    tvList: (
        category: "airing-today" | "on-the-air" | "popular" | "top-rated",
        params: TvListParams
    ) => [...tmdbKeys.all, "tv-list", category, params] as const,
};

const LIST_STALE_TIME = 30 * 60 * 1000;

export function trendingOptions(params: TrendingParams) {
    return queryOptions({
        queryFn: () => getTrendingFn({ data: params }),
        queryKey: tmdbKeys.trending(params),
        staleTime: 60 * 60 * 1000, // 1 hour — matches backend cache TTL
    });
}
export const useTrending = (params: TrendingParams) =>
    useSuspenseQuery(trendingOptions(params));

export function searchMultiOptions(params: SearchParams) {
    return queryOptions({
        enabled: params.query.length > 0,
        queryFn: () => searchMultiFn({ data: params }),
        queryKey: tmdbKeys.search(params),
        staleTime: 0, // search results shouldn't be cached long
    });
}
export const useSearchMulti = (params: SearchParams) =>
    useSuspenseQuery(searchMultiOptions(params));

export function movieDetailsOptions(params: MovieDetailsParams) {
    return queryOptions({
        queryFn: () => getMovieDetailsFn({ data: params }),
        queryKey: tmdbKeys.movie(params),
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
    });
}
export const useMovieDetails = (params: MovieDetailsParams) =>
    useSuspenseQuery(movieDetailsOptions(params));

export function tvDetailsOptions(params: TvDetailsParams) {
    return queryOptions({
        queryFn: () => getTvDetailsFn({ data: params }),
        queryKey: tmdbKeys.tv(params),
        staleTime: 24 * 60 * 60 * 1000,
    });
}
export const useTvDetails = (params: TvDetailsParams) =>
    useSuspenseQuery(tvDetailsOptions(params));

export function discoverMoviesOptions(params: DiscoverMovieParams) {
    return queryOptions({
        queryFn: () => discoverMoviesFn({ data: params }),
        queryKey: tmdbKeys.discoverMovies(params),
        staleTime: 30 * 60 * 1000,
    });
}
export const useDiscoverMovies = (params: DiscoverMovieParams) =>
    useSuspenseQuery(discoverMoviesOptions(params));

export function discoverTvOptions(params: DiscoverTvParams) {
    return queryOptions({
        queryFn: () => discoverTvFn({ data: params }),
        queryKey: tmdbKeys.discoverTv(params),
        staleTime: 30 * 60 * 1000,
    });
}
export const useDiscoverTv = (params: DiscoverTvParams) =>
    useSuspenseQuery(discoverTvOptions(params));

type ListKeyBuilder<TParams, TCategory extends string> = (
    category: TCategory,
    params: TParams
) => readonly unknown[];

function createListOptions<
    TParams extends object,
    TData,
    TCategory extends string,
>(
    fetcher: (params: TParams) => Promise<TData>,
    category: TCategory,
    keyBuilder: ListKeyBuilder<TParams, TCategory>
) {
    return (params: TParams = {} as TParams) =>
        queryOptions({
            queryFn: () => fetcher(params),
            queryKey: keyBuilder(category, params),
            staleTime: LIST_STALE_TIME,
        });
}

export const nowPlayingMoviesOptions = createListOptions(
    (params: MovieListParams) => getNowPlayingMoviesFn({ data: params }),
    "now-playing",
    tmdbKeys.movieList
);
export const useNowPlayingMovies = (params: MovieListParams = {}) =>
    useSuspenseQuery(nowPlayingMoviesOptions(params));

export const popularMoviesOptions = createListOptions(
    (params: MovieListParams) => getPopularMoviesFn({ data: params }),
    "popular",
    tmdbKeys.movieList
);
export const usePopularMovies = (params: MovieListParams = {}) =>
    useSuspenseQuery(popularMoviesOptions(params));

export const topRatedMoviesOptions = createListOptions(
    (params: MovieListParams) => getTopRatedMoviesFn({ data: params }),
    "top-rated",
    tmdbKeys.movieList
);
export const useTopRatedMovies = (params: MovieListParams = {}) =>
    useSuspenseQuery(topRatedMoviesOptions(params));

export const upcomingMoviesOptions = createListOptions(
    (params: MovieListParams) => getUpcomingMoviesFn({ data: params }),
    "upcoming",
    tmdbKeys.movieList
);
export const useUpcomingMovies = (params: MovieListParams = {}) =>
    useSuspenseQuery(upcomingMoviesOptions(params));

export const airingTodayTvOptions = createListOptions(
    (params: TvListParams) => getAiringTodayTvFn({ data: params }),
    "airing-today",
    tmdbKeys.tvList
);
export const useAiringTodayTv = (params: TvListParams = {}) =>
    useSuspenseQuery(airingTodayTvOptions(params));

export const onTheAirTvOptions = createListOptions(
    (params: TvListParams) => getOnTheAirTvFn({ data: params }),
    "on-the-air",
    tmdbKeys.tvList
);
export const useOnTheAirTv = (params: TvListParams = {}) =>
    useSuspenseQuery(onTheAirTvOptions(params));

export const popularTvOptions = createListOptions(
    (params: TvListParams) => getPopularTvFn({ data: params }),
    "popular",
    tmdbKeys.tvList
);
export const usePopularTv = (params: TvListParams = {}) =>
    useSuspenseQuery(popularTvOptions(params));

export const topRatedTvOptions = createListOptions(
    (params: TvListParams) => getTopRatedTvFn({ data: params }),
    "top-rated",
    tmdbKeys.tvList
);
export const useTopRatedTv = (params: TvListParams = {}) =>
    useSuspenseQuery(topRatedTvOptions(params));

export function personDetailsOptions(personId: number) {
    return queryOptions({
        queryFn: () => getPersonDetailsFn({ data: { person_id: personId } }),
        queryKey: tmdbKeys.person(personId),
        staleTime: 24 * 60 * 60 * 1000,
    });
}
export const usePersonDetails = (personId: number) =>
    useSuspenseQuery(personDetailsOptions(personId));

export function personCreditsOptions(personId: number) {
    return queryOptions({
        queryFn: () => getPersonCreditsFn({ data: { person_id: personId } }),
        queryKey: tmdbKeys.personCredits(personId),
        staleTime: 24 * 60 * 60 * 1000,
    });
}
export const usePersonCredits = (personId: number) =>
    useSuspenseQuery(personCreditsOptions(personId));

export function configurationOptions() {
    return queryOptions({
        queryFn: () => getConfigurationFn(),
        queryKey: tmdbKeys.configuration(),
        staleTime: Number.POSITIVE_INFINITY, // fetch once per session, effectively static
    });
}
export const useConfiguration = () => useSuspenseQuery(configurationOptions());
