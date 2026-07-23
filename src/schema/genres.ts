import { z } from "zod";
import { genreSchema } from "./common";

export const genreListResponseSchema = z.object({
    genres: z.array(genreSchema),
});
export type GenreListResponse = z.infer<typeof genreListResponseSchema>;
