import { z } from "zod";
import {
    baseParamsSchema,
    creditsSchema,
    genreSchema,
    paginatedSchema,
    productionCompanySchema,
    productionCountrySchema,
    spokenLanguageSchema,
    videosSchema,
    watchProvidersResponseSchema,
} from "./common";

/** Shape returned inside lists: trending, search, discover, recommendations */
export const movieSummarySchema = z.object({
    adult: z.boolean(),
    backdrop_path: z.string().nullable(),
    genre_ids: z.array(z.number()),
    id: z.number(),
    original_language: z.string(),
    original_title: z.string(),
    overview: z.string(),
    popularity: z.number(),
    poster_path: z.string().nullable(),
    release_date: z.string(),
    title: z.string(),
    video: z.boolean(),
    vote_average: z.number(),
    vote_count: z.number(),
});
export type MovieSummary = z.infer<typeof movieSummarySchema>;

export const movieListResponseSchema = paginatedSchema(movieSummarySchema);
export type MovieListResponse = z.infer<typeof movieListResponseSchema>;

/**
 * Full response from GET /movie/{movie_id}. The appended-response keys
 * are only present when requested via append_to_response, so they're
 * optional here even though your app will always request them.
 */
export const movieDetailsSchema = z.object({
    adult: z.boolean(),
    backdrop_path: z.string().nullable(),
    belongs_to_collection: z
        .object({
            backdrop_path: z.string().nullable(),
            id: z.number(),
            name: z.string(),
            poster_path: z.string().nullable(),
        })
        .nullable(),
    budget: z.number(),

    // present only via append_to_response
    credits: creditsSchema.optional(),
    genres: z.array(genreSchema),
    homepage: z.string().nullable(),
    id: z.number(),
    imdb_id: z.string().nullable(),
    original_language: z.string(),
    original_title: z.string(),
    overview: z.string(),
    popularity: z.number(),
    poster_path: z.string().nullable(),
    production_companies: z.array(productionCompanySchema),
    production_countries: z.array(productionCountrySchema),
    recommendations: paginatedSchema(movieSummarySchema).optional(),
    release_date: z.string(),
    revenue: z.number(),
    runtime: z.number().nullable(),
    similar: paginatedSchema(movieSummarySchema).optional(),
    spoken_languages: z.array(spokenLanguageSchema),
    status: z.string(),
    tagline: z.string().nullable(),
    title: z.string(),
    video: z.boolean(),
    videos: videosSchema.optional(),
    vote_average: z.number(),
    vote_count: z.number(),
    "watch/providers": watchProvidersResponseSchema.optional(),
});
export type MovieDetails = z.infer<typeof movieDetailsSchema>;

/** GET /movie/{movie_id} */
export const movieDetailsParamsSchema = baseParamsSchema.extend({
    append_to_response: z.string().optional(), // "credits,videos,recommendations,similar,watch/providers"
    movie_id: z.number(),
});
export type MovieDetailsParams = z.infer<typeof movieDetailsParamsSchema>;

/** GET /movie/popular | /movie/top_rated | /movie/upcoming | /movie/now_playing */
export const movieListParamsSchema = baseParamsSchema.extend({
    page: z.number().min(1).max(1000).optional(),
    region: z.string().optional(),
});
export type MovieListParams = z.infer<typeof movieListParamsSchema>;