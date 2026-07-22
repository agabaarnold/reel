import { createServerFn } from "@tanstack/react-start";
import { configurationResponseSchema } from "#/schema/configuration";
import {
    discoverMovieParamsSchema,
    discoverMovieResponseSchema,
    discoverTvParamsSchema,
    discoverTvResponseSchema,
} from "#/schema/discover";
import {
    movieDetailsParamsSchema,
    movieDetailsSchema,
    movieListParamsSchema,
    movieListResponseSchema,
} from "#/schema/movies";
import {
    personCombinedCreditsSchema,
    personCreditsParamsSchema,
    personDetailsParamsSchema,
    personDetailsSchema,
} from "#/schema/person";
import { searchMultiResponseSchema, searchParamsSchema } from "#/schema/search";
import {
    trendingParamsSchema,
    trendingResponseSchema,
} from "#/schema/trending";
import {
    tvDetailsParamsSchema,
    tvDetailsSchema,
    tvListParamsSchema,
    tvListResponseSchema,
} from "#/schema/tv";
import { tmdbApi } from "./tmdb";

export const getTrendingFn = createServerFn({ method: "GET", strict: false })
    .validator((data: unknown) => trendingParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getTrending(data);
        return trendingResponseSchema.parse(result);
    });

export const searchMultiFn = createServerFn({ method: "GET", strict: false })
    .validator((data: unknown) => searchParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.searchMulti(data);
        return searchMultiResponseSchema.parse(result);
    });

export const getMovieDetailsFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => movieDetailsParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getMovieDetails(data);
        return movieDetailsSchema.parse(result);
    });

export const getNowPlayingMoviesFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => movieListParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getMovieList("now_playing", data);
        return movieListResponseSchema.parse(result);
    });

export const getPopularMoviesFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => movieListParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getMovieList("popular", data);
        return movieListResponseSchema.parse(result);
    });

export const getTopRatedMoviesFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => movieListParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getMovieList("top_rated", data);
        return movieListResponseSchema.parse(result);
    });

export const getUpcomingMoviesFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => movieListParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getMovieList("upcoming", data);
        return movieListResponseSchema.parse(result);
    });

export const getTvDetailsFn = createServerFn({ method: "GET", strict: false })
    .validator((data: unknown) => tvDetailsParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getTvDetails(data);
        return tvDetailsSchema.parse(result);
    });

export const getAiringTodayTvFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => tvListParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getTvList("airing_today", data);
        return tvListResponseSchema.parse(result);
    });

export const getOnTheAirTvFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => tvListParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getTvList("on_the_air", data);
        return tvListResponseSchema.parse(result);
    });

export const getPopularTvFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => tvListParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getTvList("popular", data);
        return tvListResponseSchema.parse(result);
    });

export const getTopRatedTvFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => tvListParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getTvList("top_rated", data);
        return tvListResponseSchema.parse(result);
    });

export const discoverMoviesFn = createServerFn({ method: "GET", strict: false })
    .validator((data: unknown) => discoverMovieParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.discoverMovies(data);
        return discoverMovieResponseSchema.parse(result);
    });

export const discoverTvFn = createServerFn({ method: "GET", strict: false })
    .validator((data: unknown) => discoverTvParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.discoverTv(data);
        return discoverTvResponseSchema.parse(result);
    });

export const getPersonDetailsFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => personDetailsParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getPersonDetails(data);
        return personDetailsSchema.parse(result);
    });

export const getPersonCreditsFn = createServerFn({
    method: "GET",
    strict: false,
})
    .validator((data: unknown) => personCreditsParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getPersonCombinedCredits(data);
        return personCombinedCreditsSchema.parse(result);
    });

export const getConfigurationFn = createServerFn({
    method: "GET",
    strict: false,
}).handler(async () => {
    const result = await tmdbApi.getConfiguration();
    return configurationResponseSchema.parse(result);
});
