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

function createMovieListFn(
    category: "now_playing" | "popular" | "top_rated" | "upcoming"
) {
    return createServerFn({ method: "GET", strict: false })
        .validator((data: unknown) => movieListParamsSchema.parse(data))
        .handler(async ({ data }) => {
            const result = await tmdbApi.getMovieList(category, data);
            return movieListResponseSchema.parse(result);
        });
}

export const getNowPlayingMoviesFn = createMovieListFn("now_playing");
export const getPopularMoviesFn = createMovieListFn("popular");
export const getTopRatedMoviesFn = createMovieListFn("top_rated");
export const getUpcomingMoviesFn = createMovieListFn("upcoming");

export const getTvDetailsFn = createServerFn({ method: "GET", strict: false })
    .validator((data: unknown) => tvDetailsParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getTvDetails(data);
        return tvDetailsSchema.parse(result);
    });

function createTvListFn(
    category: "airing_today" | "on_the_air" | "popular" | "top_rated"
) {
    return createServerFn({ method: "GET", strict: false })
        .validator((data: unknown) => tvListParamsSchema.parse(data))
        .handler(async ({ data }) => {
            const result = await tmdbApi.getTvList(category, data);
            return tvListResponseSchema.parse(result);
        });
}

export const getAiringTodayTvFn = createTvListFn("airing_today");
export const getOnTheAirTvFn = createTvListFn("on_the_air");
export const getPopularTvFn = createTvListFn("popular");
export const getTopRatedTvFn = createTvListFn("top_rated");

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
