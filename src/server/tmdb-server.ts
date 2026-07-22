import { createServerFn } from "@tanstack/react-start";
import { configurationResponseSchema } from "#/schema/configuration";
import {
    discoverMovieParamsSchema,
    discoverMovieResponseSchema,
    discoverTvParamsSchema,
    discoverTvResponseSchema,
} from "#/schema/discover";
import { movieDetailsParamsSchema, movieDetailsSchema } from "#/schema/movies";
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
import { tvDetailsParamsSchema, tvDetailsSchema } from "#/schema/tv";
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

export const getTvDetailsFn = createServerFn({ method: "GET", strict: false })
    .validator((data: unknown) => tvDetailsParamsSchema.parse(data))
    .handler(async ({ data }) => {
        const result = await tmdbApi.getTvDetails(data);
        return tvDetailsSchema.parse(result);
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
