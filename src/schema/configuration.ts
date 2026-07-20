import { z } from "zod";

/** GET /configuration — call once and cache indefinitely (values rarely change) */
export const configurationResponseSchema = z.object({
    change_keys: z.array(z.string()),
    images: z.object({
        backdrop_sizes: z.array(z.string()), // e.g. ["w300","w780","w1280","original"]
        base_url: z.string(),
        logo_sizes: z.array(z.string()),
        poster_sizes: z.array(z.string()), // e.g. ["w92","w154","w185","w342","w500","w780","original"]
        profile_sizes: z.array(z.string()),
        secure_base_url: z.string(),
        still_sizes: z.array(z.string()),
    }),
});
export type ConfigurationResponse = z.infer<typeof configurationResponseSchema>;

/** Helper to build a full TMDB image URL from a path + size */
export function buildImageUrl(
    config: Pick<ConfigurationResponse["images"], "secure_base_url">,
    path: string | null,
    size: string
): string | null {
    if (!path) {
        return null;
    }

    return `${config.secure_base_url}${size}${path}`;
}
