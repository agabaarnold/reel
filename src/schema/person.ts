import { z } from "zod";
import { baseParamsSchema, paginatedSchema } from "./common";

export const personSummarySchema = z.object({
    adult: z.boolean(),
    gender: z.number().nullable(),
    id: z.number(),
    // present on /search/person and /trending/person results
    known_for: z.array(z.unknown()).optional(),
    known_for_department: z.string(),
    name: z.string(),
    original_name: z.string(),
    popularity: z.number(),
    profile_path: z.string().nullable(),
});
export type PersonSummary = z.infer<typeof personSummarySchema>;

export const personListResponseSchema = paginatedSchema(personSummarySchema);
export type PersonListResponse = z.infer<typeof personListResponseSchema>;

export const personDetailsSchema = z.object({
    adult: z.boolean(),
    also_known_as: z.array(z.string()),
    biography: z.string(),
    birthday: z.string().nullable(),
    deathday: z.string().nullable(),
    gender: z.number().nullable(),
    homepage: z.string().nullable(),
    id: z.number(),
    imdb_id: z.string().nullable(),
    known_for_department: z.string(),
    name: z.string(),
    place_of_birth: z.string().nullable(),
    popularity: z.number(),
    profile_path: z.string().nullable(),
});
export type PersonDetails = z.infer<typeof personDetailsSchema>;

/** GET /person/{person_id} */
export const personDetailsParamsSchema = baseParamsSchema.extend({
    append_to_response: z.string().optional(), // "movie_credits,tv_credits"
    person_id: z.number(),
});
export type PersonDetailsParams = z.infer<typeof personDetailsParamsSchema>;

export const creditWithMediaTypeSchema = z.object({
    character: z.string().optional(),
    department: z.string().optional(),
    first_air_date: z.string().optional(),
    id: z.number(),
    job: z.string().optional(),
    media_type: z.enum(["movie", "tv"]),
    name: z.string().optional(), // tv
    poster_path: z.string().nullable(),
    release_date: z.string().optional(),
    title: z.string().optional(), // movie
    vote_average: z.number(),
});
export type CreditWithMediaType = z.infer<typeof creditWithMediaTypeSchema>;

/** GET /person/{person_id}/combined_credits */
export const personCombinedCreditsSchema = z.object({
    cast: z.array(creditWithMediaTypeSchema),
    crew: z.array(creditWithMediaTypeSchema),
    id: z.number(),
});
export type PersonCombinedCredits = z.infer<typeof personCombinedCreditsSchema>;

/** GET /person/{person_id}/combined_credits */
export const personCreditsParamsSchema = baseParamsSchema.extend({
    person_id: z.number(),
});
export type PersonCreditsParams = z.infer<typeof personCreditsParamsSchema>;
