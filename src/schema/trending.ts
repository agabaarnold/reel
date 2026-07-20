import { z } from "zod";
import { paginatedSchema } from "./common";
import { movieSummarySchema } from "./movies";
import { personSummarySchema } from "./person";
import { tvSummarySchema } from "./tv";

/**
 * /trending/{media_type}/{time_window} can return movies, tv shows, or
 * people depending on media_type. Each item carries a media_type
 * discriminant so you can narrow it client-side.
 */
export const trendingMovieItemSchema = movieSummarySchema.extend({
    media_type: z.literal("movie"),
});
export const trendingTvItemSchema = tvSummarySchema.extend({
    media_type: z.literal("tv"),
});
export const trendingPersonItemSchema = personSummarySchema.extend({
    media_type: z.literal("person"),
});

export const trendingItemSchema = z.discriminatedUnion("media_type", [
    trendingMovieItemSchema,
    trendingTvItemSchema,
    trendingPersonItemSchema,
]);
export type TrendingItem = z.infer<typeof trendingItemSchema>;

export const trendingResponseSchema = paginatedSchema(trendingItemSchema);
export type TrendingResponse = z.infer<typeof trendingResponseSchema>;

/** GET /trending/{media_type}/{time_window} */
export const trendingParamsSchema = z.object({
    media_type: z.enum(["all", "movie", "tv", "person"]),
    page: z.number().int().min(1).max(500).optional(),
    time_window: z.enum(["day", "week"]),
});
export type TrendingParams = z.infer<typeof trendingParamsSchema>;
