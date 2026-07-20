import { z } from "zod";
import { baseParamsSchema, paginatedSchema } from "./common";
import { movieSummarySchema } from "./movies";
import { personSummarySchema } from "./person";
import { tvSummarySchema } from "./tv";

/** GET /search/multi — mixed movie/tv/person results */
export const searchMovieResultSchema = movieSummarySchema.extend({
    media_type: z.literal("movie"),
});
export const searchTvResultSchema = tvSummarySchema.extend({
    media_type: z.literal("tv"),
});
export const searchPersonResultSchema = personSummarySchema.extend({
    media_type: z.literal("person"),
});

export const searchMultiItemSchema = z.discriminatedUnion("media_type", [
    searchMovieResultSchema,
    searchTvResultSchema,
    searchPersonResultSchema,
]);
export type SearchMultiItem = z.infer<typeof searchMultiItemSchema>;

export const searchMultiResponseSchema = paginatedSchema(searchMultiItemSchema);
export type SearchMultiResponse = z.infer<typeof searchMultiResponseSchema>;

export const searchParamsSchema = baseParamsSchema.extend({
    first_air_date_year: z.number().optional(), // /search/tv only
    include_adult: z.boolean().optional(),
    page: z.number().int().min(1).max(500).optional(),
    query: z.string().min(1),
    year: z.number().optional(), // /search/movie only
});
export type SearchParams = z.infer<typeof searchParamsSchema>;

/** GET /search/movie */
export const searchMovieResponseSchema = paginatedSchema(movieSummarySchema);
export type SearchMovieResponse = z.infer<typeof searchMovieResponseSchema>;

/** GET /search/tv */
export const searchTvResponseSchema = paginatedSchema(tvSummarySchema);
export type SearchTvResponse = z.infer<typeof searchTvResponseSchema>;
