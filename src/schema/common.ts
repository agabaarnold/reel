import { z } from "zod";

export const genreSchema = z.object({
    id: z.number(),
    name: z.string(),
});
export type Genre = z.infer<typeof genreSchema>;

export const productionCompanySchema = z.object({
    id: z.number(),
    logo_path: z.string().nullable(),
    name: z.string(),
    origin_country: z.string(),
});
export type ProductionCompany = z.infer<typeof productionCompanySchema>;

export const productionCountrySchema = z.object({
    iso_3166_1: z.string(),
    name: z.string(),
});
export type ProductionCountry = z.infer<typeof productionCountrySchema>;

export const spokenLanguageSchema = z.object({
    english_name: z.string(),
    iso_639_1: z.string(),
    name: z.string(),
});
export type SpokenLanguage = z.infer<typeof spokenLanguageSchema>;

export const castMemberSchema = z.object({
    adult: z.boolean(),
    cast_id: z.number().optional(),
    character: z.string(),
    credit_id: z.string(),
    gender: z.number().nullable(),
    id: z.number(),
    known_for_department: z.string(),
    name: z.string(),
    order: z.number(),
    original_name: z.string(),
    popularity: z.number(),
    profile_path: z.string().nullable(),
});
export type CastMember = z.infer<typeof castMemberSchema>;

export const crewMemberSchema = z.object({
    adult: z.boolean(),
    credit_id: z.string(),
    department: z.string(),
    gender: z.number().nullable(),
    id: z.number(),
    job: z.string(),
    known_for_department: z.string(),
    name: z.string(),
    original_name: z.string(),
    popularity: z.number(),
    profile_path: z.string().nullable(),
});
export type CrewMember = z.infer<typeof crewMemberSchema>;

export const creditsSchema = z.object({
    cast: z.array(castMemberSchema),
    crew: z.array(crewMemberSchema),
    id: z.number().optional(),
});
export type Credits = z.infer<typeof creditsSchema>;

export const videoSchema = z.object({
    id: z.string(),
    iso_639_1: z.string(),
    iso_3166_1: z.string(),
    key: z.string(),
    name: z.string(),
    official: z.boolean(),
    published_at: z.string(),
    site: z.string(), // "YouTube" | "Vimeo"
    size: z.number(),
    type: z.string(), // "Trailer" | "Teaser" | "Clip" | ...
});
export type Video = z.infer<typeof videoSchema>;

export const videosSchema = z.object({
    results: z.array(videoSchema),
});
export type Videos = z.infer<typeof videosSchema>;

export const watchProviderSchema = z.object({
    display_priority: z.number(),
    logo_path: z.string(),
    provider_id: z.number(),
    provider_name: z.string(),
});
export type WatchProvider = z.infer<typeof watchProviderSchema>;

export const regionWatchProvidersSchema = z.object({
    ads: z.array(watchProviderSchema).optional(),
    buy: z.array(watchProviderSchema).optional(),
    flatrate: z.array(watchProviderSchema).optional(),
    free: z.array(watchProviderSchema).optional(),
    link: z.string().optional(),
    rent: z.array(watchProviderSchema).optional(),
});
export type RegionWatchProviders = z.infer<typeof regionWatchProvidersSchema>;

/** Keyed by ISO 3166-1 region code, e.g. results["US"] */
export const watchProvidersResponseSchema = z.object({
    id: z.number().optional(),
    results: z.record(z.string(), regionWatchProvidersSchema),
});
export type WatchProvidersResponse = z.infer<
    typeof watchProvidersResponseSchema
>;

/** Generic TMDB paginated list wrapper */
export const paginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
    z.object({
        page: z.number(),
        results: z.array(item),
        total_pages: z.number(),
        total_results: z.number(),
    });
export interface Paginated<T> {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

/** Shared query params accepted by most GET endpoints */
export const baseParamsSchema = z.object({
    language: z.string().optional(), // e.g. "en-US"
});
