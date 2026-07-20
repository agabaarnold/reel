import { z } from "zod";
import { baseParamsSchema, watchProviderSchema } from "./common";

/** GET /watch/providers/movie or /watch/providers/tv — the full catalog for a region */
export const watchProviderListResponseSchema = z.object({
    results: z.array(
        watchProviderSchema.extend({
            display_priorities: z.record(z.string(), z.number()).optional(),
        })
    ),
});
export type WatchProviderListResponse = z.infer<
    typeof watchProviderListResponseSchema
>;

/** GET /watch/providers/movie | /watch/providers/tv */
export const watchProviderListParamsSchema = baseParamsSchema.extend({
    watch_region: z.string().optional(), // e.g. "US"
});
export type WatchProviderListParams = z.infer<
    typeof watchProviderListParamsSchema
>;

/** GET /watch/providers/regions — list of regions TMDB supports */
export const watchProviderRegionSchema = z.object({
    english_name: z.string(),
    iso_3166_1: z.string(),
    native_name: z.string(),
});
export const watchProviderRegionsResponseSchema = z.object({
    results: z.array(watchProviderRegionSchema),
});
export type WatchProviderRegionsResponse = z.infer<
    typeof watchProviderRegionsResponseSchema
>;
