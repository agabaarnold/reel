import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { DiscoverMovieParams, DiscoverTvParams } from "#/schema/discover";
import type { MovieDetailsParams, MovieListParams } from "#/schema/movies";
import type { PersonListParams } from "#/schema/person";
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
    getPopularPeopleFn,
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
    popularPeople: (params: PersonListParams) =>
        [...tmdbKeys.all, "popular-people", params] as const,
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

export function upcomingMoviesOptions(params: MovieListParams = {}) {
    return queryOptions({
        queryFn: () => getUpcomingMoviesFn({ data: params }),
        queryKey: tmdbKeys.movieList("upcoming", params),
        staleTime: LIST_STALE_TIME,
    });
}
export const useUpcomingMovies = (params: MovieListParams = {}) =>
    useSuspenseQuery(upcomingMoviesOptions(params));

export function popularMoviesOptions(params: MovieListParams = {}) {
    return queryOptions({
        queryFn: () => getPopularMoviesFn({ data: params }),
        queryKey: tmdbKeys.movieList("popular", params),
        staleTime: LIST_STALE_TIME,
    });
}
export const usePopularMovies = (params: MovieListParams = {}) =>
    useSuspenseQuery(popularMoviesOptions(params));

export function topRatedMoviesOptions(params: MovieListParams = {}) {
    return queryOptions({
        queryFn: () => getTopRatedMoviesFn({ data: params }),
        queryKey: tmdbKeys.movieList("top-rated", params),
        staleTime: LIST_STALE_TIME,
    });
}
export const useTopRatedMovies = (params: MovieListParams = {}) =>
    useSuspenseQuery(topRatedMoviesOptions(params));

export function nowPlayingMoviesOptions(params: MovieListParams = {}) {
    return queryOptions({
        queryFn: () => getNowPlayingMoviesFn({ data: params }),
        queryKey: tmdbKeys.movieList("now-playing", params),
        staleTime: LIST_STALE_TIME,
    });
}
export const useNowPlayingMovies = (params: MovieListParams = {}) =>
    useSuspenseQuery(nowPlayingMoviesOptions(params));

export function airingTodayTvOptions(params: TvListParams = {}) {
    return queryOptions({
        queryFn: () => getAiringTodayTvFn({ data: params }),
        queryKey: tmdbKeys.tvList("airing-today", params),
        staleTime: LIST_STALE_TIME,
    });
}
export const useAiringTodayTv = (params: TvListParams = {}) =>
    useSuspenseQuery(airingTodayTvOptions(params));

export function onTheAirTvOptions(params: TvListParams = {}) {
    return queryOptions({
        queryFn: () => getOnTheAirTvFn({ data: params }),
        queryKey: tmdbKeys.tvList("on-the-air", params),
        staleTime: LIST_STALE_TIME,
    });
}
export const useOnTheAirTv = (params: TvListParams = {}) =>
    useSuspenseQuery(onTheAirTvOptions(params));

export function popularTvOptions(params: TvListParams = {}) {
    return queryOptions({
        queryFn: () => getPopularTvFn({ data: params }),
        queryKey: tmdbKeys.tvList("popular", params),
        staleTime: LIST_STALE_TIME,
    });
}
export const usePopularTv = (params: TvListParams = {}) =>
    useSuspenseQuery(popularTvOptions(params));

export function topRatedTvOptions(params: TvListParams = {}) {
    return queryOptions({
        queryFn: () => getTopRatedTvFn({ data: params }),
        queryKey: tmdbKeys.tvList("top-rated", params),
        staleTime: LIST_STALE_TIME,
    });
}
export const useTopRatedTv = (params: TvListParams = {}) =>
    useSuspenseQuery(topRatedTvOptions(params));

export function popularPeopleOptions(params: PersonListParams = {}) {
    return queryOptions({
        queryFn: () => getPopularPeopleFn({ data: params }),
        queryKey: tmdbKeys.popularPeople(params),
        staleTime: LIST_STALE_TIME,
    });
}
export const usePopularPeople = (params: PersonListParams = {}) =>
    useSuspenseQuery(popularPeopleOptions(params));

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
