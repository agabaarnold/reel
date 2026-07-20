import { z } from "zod";
import { baseParamsSchema, paginatedSchema } from "./common";
import { movieSummarySchema } from "./movies";
import { tvSummarySchema } from "./tv";

/** GET /discover/movie */
export const discoverMovieParamsSchema = baseParamsSchema
    .extend({
        page: z.number().int().min(1).max(500).optional(),
        "primary_release_date.gte": z.string().optional(),
        "primary_release_date.lte": z.string().optional(),
        primary_release_year: z.number().optional(),
        region: z.string().optional(),
        sort_by: z
            .enum([
                "popularity.desc",
                "popularity.asc",
                "vote_average.desc",
                "vote_average.asc",
                "release_date.desc",
                "release_date.asc",
                "revenue.desc",
                "revenue.asc",
            ])
            .optional(),
        "vote_average.gte": z.number().optional(),
        "vote_average.lte": z.number().optional(),
        "vote_count.gte": z.number().optional(),
        watch_region: z.string().optional(),
        with_genres: z.string().optional(), // comma-separated genre ids
        with_original_language: z.string().optional(),
        "with_runtime.gte": z.number().optional(),
        "with_runtime.lte": z.number().optional(),
        with_watch_providers: z.string().optional(), // comma-separated provider ids
        without_genres: z.string().optional(),
    })
    .refine((data) => !data.with_watch_providers || data.watch_region, {
        message: "watch_region is required when with_watch_providers is set",
        path: ["watch_region"],
    });
export type DiscoverMovieParams = z.infer<typeof discoverMovieParamsSchema>;

export const discoverMovieResponseSchema = paginatedSchema(movieSummarySchema);
export type DiscoverMovieResponse = z.infer<typeof discoverMovieResponseSchema>;

/** GET /discover/tv */
export const discoverTvParamsSchema = baseParamsSchema
    .extend({
        first_air_date_year: z.number().optional(),
        "first_air_date.gte": z.string().optional(),
        "first_air_date.lte": z.string().optional(),
        page: z.number().int().min(1).max(500).optional(),
        sort_by: z
            .enum([
                "popularity.desc",
                "popularity.asc",
                "vote_average.desc",
                "vote_average.asc",
                "first_air_date.desc",
                "first_air_date.asc",
            ])
            .optional(),
        "vote_average.gte": z.number().optional(),
        "vote_average.lte": z.number().optional(),
        "vote_count.gte": z.number().optional(),
        watch_region: z.string().optional(),
        with_genres: z.string().optional(),
        with_original_language: z.string().optional(),
        "with_runtime.gte": z.number().optional(),
        "with_runtime.lte": z.number().optional(),
        with_watch_providers: z.string().optional(),
        without_genres: z.string().optional(),
    })
    .refine((data) => !data.with_watch_providers || data.watch_region, {
        message: "watch_region is required when with_watch_providers is set",
        path: ["watch_region"],
    });
export type DiscoverTvParams = z.infer<typeof discoverTvParamsSchema>;

export const discoverTvResponseSchema = paginatedSchema(tvSummarySchema);
export type DiscoverTvResponse = z.infer<typeof discoverTvResponseSchema>;
