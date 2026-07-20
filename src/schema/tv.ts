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

export const tvSummarySchema = z.object({
    adult: z.boolean(),
    backdrop_path: z.string().nullable(),
    first_air_date: z.string(),
    genre_ids: z.array(z.number()),
    id: z.number(),
    name: z.string(),
    origin_country: z.array(z.string()),
    original_language: z.string(),
    original_name: z.string(),
    overview: z.string(),
    popularity: z.number(),
    poster_path: z.string().nullable(),
    vote_average: z.number(),
    vote_count: z.number(),
});
export type TvSummary = z.infer<typeof tvSummarySchema>;

export const tvListResponseSchema = paginatedSchema(tvSummarySchema);
export type TvListResponse = z.infer<typeof tvListResponseSchema>;

export const tvSeasonSummarySchema = z.object({
    air_date: z.string().nullable(),
    episode_count: z.number(),
    id: z.number(),
    name: z.string(),
    overview: z.string(),
    poster_path: z.string().nullable(),
    season_number: z.number(),
    vote_average: z.number(),
});
export type TvSeasonSummary = z.infer<typeof tvSeasonSummarySchema>;

export const tvDetailsSchema = z.object({
    adult: z.boolean(),
    backdrop_path: z.string().nullable(),
    created_by: z.array(
        z.object({
            credit_id: z.string(),
            gender: z.number().nullable(),
            id: z.number(),
            name: z.string(),
            profile_path: z.string().nullable(),
        })
    ),

    // present only via append_to_response
    credits: creditsSchema.optional(),
    episode_run_time: z.array(z.number()),
    first_air_date: z.string(),
    genres: z.array(genreSchema),
    homepage: z.string(),
    id: z.number(),
    in_production: z.boolean(),
    languages: z.array(z.string()),
    last_air_date: z.string(),
    name: z.string(),
    networks: z.array(productionCompanySchema),
    number_of_episodes: z.number(),
    number_of_seasons: z.number(),
    origin_country: z.array(z.string()),
    original_language: z.string(),
    original_name: z.string(),
    overview: z.string(),
    popularity: z.number(),
    poster_path: z.string().nullable(),
    production_companies: z.array(productionCompanySchema),
    production_countries: z.array(productionCountrySchema),
    recommendations: paginatedSchema(tvSummarySchema).optional(),
    seasons: z.array(tvSeasonSummarySchema),
    similar: paginatedSchema(tvSummarySchema).optional(),
    spoken_languages: z.array(spokenLanguageSchema),
    status: z.string(),
    tagline: z.string(),
    type: z.string(),
    videos: videosSchema.optional(),
    vote_average: z.number(),
    vote_count: z.number(),
    "watch/providers": watchProvidersResponseSchema.optional(),
});
export type TvDetails = z.infer<typeof tvDetailsSchema>;

/** GET /tv/{series_id} */
export const tvDetailsParamsSchema = baseParamsSchema.extend({
    append_to_response: z.string().optional(),
    series_id: z.number(),
});
export type TvDetailsParams = z.infer<typeof tvDetailsParamsSchema>;

/** GET /tv/popular | /tv/top_rated | /tv/on_the_air | /tv/airing_today */
export const tvListParamsSchema = baseParamsSchema.extend({
    page: z.number().min(1).max(1000).optional(),
});
export type TvListParams = z.infer<typeof tvListParamsSchema>;
