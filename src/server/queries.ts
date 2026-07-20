import { queryOptions, useQuery } from "@tanstack/react-query";
import type { DiscoverMovieParams, DiscoverTvParams } from "#/schema/discover";
import type { MovieDetailsParams } from "#/schema/movies";
import type { SearchParams } from "#/schema/search";
import type { TrendingParams } from "#/schema/trending";
import type { TvDetailsParams } from "#/schema/tv";
import { tmdbApi } from "./tmdb";

/**
 * Each of these calls YOUR backend's proxy route (e.g. /tmdb/trending),
 * which internally calls tmdbClient and returns the same validated
 * shape — so the response type here matches the TMDB schema exactly,
 * no re-mapping needed.
 *
 * queryOptions() (TanStack Query v5) lets you reuse the same options
 * object for useQuery, prefetchQuery, and ensureQueryData.
 */

export const tmdbKeys = {
    all: ["tmdb"] as const,
    configuration: () => [...tmdbKeys.all, "configuration"] as const,
    discoverMovies: (params: DiscoverMovieParams) =>
        [...tmdbKeys.all, "discover-movie", params] as const,
    discoverTv: (params: DiscoverTvParams) =>
        [...tmdbKeys.all, "discover-tv", params] as const,
    movie: (id: number) => [...tmdbKeys.all, "movie", id] as const,
    person: (id: number) => [...tmdbKeys.all, "person", id] as const,
    personCredits: (id: number) =>
        [...tmdbKeys.all, "person-credits", id] as const,
    search: (params: SearchParams) =>
        [...tmdbKeys.all, "search", params] as const,
    trending: (params: TrendingParams) =>
        [...tmdbKeys.all, "trending", params] as const,
    tv: (id: number) => [...tmdbKeys.all, "tv", id] as const,
};

export function trendingOptions(params: TrendingParams) {
    return queryOptions({
        queryFn: async () => {
            const data = await tmdbApi.getTrending(params);
            return data;
        },
        queryKey: tmdbKeys.trending(params),
        staleTime: 60 * 60 * 1000, // 1 hour — matches backend cache TTL
    });
}
export const useTrending = (params: TrendingParams) =>
    useQuery(trendingOptions(params));

export function searchMultiOptions(params: SearchParams) {
    return queryOptions({
        enabled: params.query.length > 0,
        queryFn: async () => {
            const data = await tmdbApi.searchMulti(params);
            return data;
        },
        queryKey: tmdbKeys.search(params),
        staleTime: 0, // search results shouldn't be cached long
    });
}
export const useSearchMulti = (params: SearchParams) =>
    useQuery(searchMultiOptions(params));

export function movieDetailsOptions(params: MovieDetailsParams) {
    return queryOptions({
        queryFn: async () => {
            const data = await tmdbApi.getMovieDetails(params);
            return data;
        },
        queryKey: tmdbKeys.movie(params.movie_id),
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
    });
}
export const useMovieDetails = (params: MovieDetailsParams) =>
    useQuery(movieDetailsOptions(params));

export function tvDetailsOptions(params: TvDetailsParams) {
    return queryOptions({
        queryFn: async () => {
            const data = await tmdbApi.getTvDetails(params);
            return data;
        },
        queryKey: tmdbKeys.tv(params.series_id),
        staleTime: 24 * 60 * 60 * 1000,
    });
}
export const useTvDetails = (params: TvDetailsParams) =>
    useQuery(tvDetailsOptions(params));

export function discoverMoviesOptions(params: DiscoverMovieParams) {
    return queryOptions({
        queryFn: async () => {
            const data = await tmdbApi.discoverMovies(params);
            return data;
        },
        queryKey: tmdbKeys.discoverMovies(params),
        staleTime: 30 * 60 * 1000,
    });
}
export const useDiscoverMovies = (params: DiscoverMovieParams) =>
    useQuery(discoverMoviesOptions(params));

export function discoverTvOptions(params: DiscoverTvParams) {
    return queryOptions({
        queryFn: async () => {
            const data = await tmdbApi.discoverTv(params);
            return data;
        },
        queryKey: tmdbKeys.discoverTv(params),
        staleTime: 30 * 60 * 1000,
    });
}
export const useDiscoverTv = (params: DiscoverTvParams) =>
    useQuery(discoverTvOptions(params));

export function personDetailsOptions(personId: number) {
    return queryOptions({
        queryFn: async () => {
            const data = await tmdbApi.getPersonDetails({
                person_id: personId,
            });
            return data;
        },
        queryKey: tmdbKeys.person(personId),
        staleTime: 24 * 60 * 60 * 1000,
    });
}
export const usePersonDetails = (personId: number) =>
    useQuery(personDetailsOptions(personId));

export function personCreditsOptions(personId: number) {
    return queryOptions({
        queryFn: async () => {
            const data = await tmdbApi.getPersonCombinedCredits({
                person_id: personId,
            });
            return data;
        },
        queryKey: tmdbKeys.personCredits(personId),
        staleTime: 24 * 60 * 60 * 1000,
    });
}
export const usePersonCredits = (personId: number) =>
    useQuery(personCreditsOptions(personId));

export function configurationOptions() {
    return queryOptions({
        queryFn: async () => {
            const data = await tmdbApi.getConfiguration();
            return data;
        },
        queryKey: tmdbKeys.configuration(),
        staleTime: Number.POSITIVE_INFINITY, // fetch once per session, effectively static
    });
}
export const useConfiguration = () => useQuery(configurationOptions());
