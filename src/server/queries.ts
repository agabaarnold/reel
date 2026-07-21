import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { DiscoverMovieParams, DiscoverTvParams } from "#/schema/discover";
import type { MovieDetailsParams } from "#/schema/movies";
import type { SearchParams } from "#/schema/search";
import type { TrendingParams } from "#/schema/trending";
import type { TvDetailsParams } from "#/schema/tv";
import {
    discoverMoviesFn,
    discoverTvFn,
    getConfigurationFn,
    getMovieDetailsFn,
    getPersonCreditsFn,
    getPersonDetailsFn,
    getTrendingFn,
    getTvDetailsFn,
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
    person: (id: number) => [...tmdbKeys.all, "person", id] as const,
    personCredits: (id: number) =>
        [...tmdbKeys.all, "person-credits", id] as const,
    search: (params: SearchParams) =>
        [...tmdbKeys.all, "search", params] as const,
    trending: (params: TrendingParams) =>
        [...tmdbKeys.all, "trending", params] as const,
    tv: (params: TvDetailsParams) => [...tmdbKeys.all, "tv", params] as const,
};

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
