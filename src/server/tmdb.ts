import {
    type ConfigurationResponse,
    configurationResponseSchema,
} from "#/schema/configuration";
import {
    type DiscoverMovieParams,
    type DiscoverMovieResponse,
    type DiscoverTvParams,
    type DiscoverTvResponse,
    discoverMovieParamsSchema,
    discoverMovieResponseSchema,
    discoverTvParamsSchema,
    discoverTvResponseSchema,
} from "#/schema/discover";
import {
    type MovieDetails,
    type MovieDetailsParams,
    type MovieListParams,
    type MovieListResponse,
    movieDetailsParamsSchema,
    movieDetailsSchema,
    movieListParamsSchema,
    movieListResponseSchema,
} from "#/schema/movies";
import {
    type PersonCombinedCredits,
    type PersonCreditsParams,
    type PersonDetails,
    type PersonDetailsParams,
    type PersonListParams,
    type PersonListResponse,
    personCombinedCreditsSchema,
    personCreditsParamsSchema,
    personDetailsParamsSchema,
    personDetailsSchema,
    personListParamsSchema,
    personListResponseSchema,
} from "#/schema/person";
import {
    type SearchMultiResponse,
    type SearchParams,
    searchMultiResponseSchema,
    searchParamsSchema,
} from "#/schema/search";
import {
    type TrendingParams,
    type TrendingResponse,
    trendingParamsSchema,
    trendingResponseSchema,
} from "#/schema/trending";
import {
    type TvDetails,
    type TvDetailsParams,
    type TvListParams,
    type TvListResponse,
    tvDetailsParamsSchema,
    tvDetailsSchema,
    tvListParamsSchema,
    tvListResponseSchema,
} from "#/schema/tv";
import {
    type WatchProviderListParams,
    type WatchProviderListResponse,
    watchProviderListParamsSchema,
    watchProviderListResponseSchema,
} from "#/schema/watch-providers";
import tmdbClient from "./api";

// A response that fails schema validation is a signal TMDB changed
// something upstream — better to throw loudly than serve bad data.
async function get<T>(
    schema: { parse: (data: unknown) => T },
    url: string,
    params?: Record<string, unknown>
): Promise<T> {
    const { data } = await tmdbClient.get(url, { params });
    return schema.parse(data);
}

export const tmdbApi = {
    discoverMovies(
        params: DiscoverMovieParams
    ): Promise<DiscoverMovieResponse> {
        const p = discoverMovieParamsSchema.parse(params);
        return get(discoverMovieResponseSchema, "/discover/movie", p);
    },

    discoverTv(params: DiscoverTvParams): Promise<DiscoverTvResponse> {
        const p = discoverTvParamsSchema.parse(params);
        return get(discoverTvResponseSchema, "/discover/tv", p);
    },

    // Cache this one indefinitely — it almost never changes
    getConfiguration(): Promise<ConfigurationResponse> {
        return get(configurationResponseSchema, "/configuration");
    },

    getMovieDetails(params: MovieDetailsParams): Promise<MovieDetails> {
        const p = movieDetailsParamsSchema.parse(params);
        return get(movieDetailsSchema, `/movie/${p.movie_id}`, {
            append_to_response:
                p.append_to_response ??
                "credits,videos,recommendations,similar,watch/providers",
            language: p.language,
        });
    },

    getMovieList(
        category: "now_playing" | "popular" | "top_rated" | "upcoming",
        params: MovieListParams
    ): Promise<MovieListResponse> {
        const p = movieListParamsSchema.parse(params);
        return get(movieListResponseSchema, `/movie/${category}`, p);
    },

    getPersonCombinedCredits(
        params: PersonCreditsParams
    ): Promise<PersonCombinedCredits> {
        const p = personCreditsParamsSchema.parse(params);
        return get(
            personCombinedCreditsSchema,
            `/person/${p.person_id}/combined_credits`,
            { language: p.language }
        );
    },

    getPersonDetails(params: PersonDetailsParams): Promise<PersonDetails> {
        const p = personDetailsParamsSchema.parse(params);
        return get(personDetailsSchema, `/person/${p.person_id}`, {
            language: p.language,
        });
    },

    getPopularPeople(params: PersonListParams): Promise<PersonListResponse> {
        const p = personListParamsSchema.parse(params);
        return get(personListResponseSchema, "/person/popular", p);
    },
    getTrending(params: TrendingParams): Promise<TrendingResponse> {
        const p = trendingParamsSchema.parse(params);
        return get(
            trendingResponseSchema,
            `/trending/${p.media_type}/${p.time_window}`,
            { page: p.page }
        );
    },

    getTvDetails(params: TvDetailsParams): Promise<TvDetails> {
        const p = tvDetailsParamsSchema.parse(params);
        return get(tvDetailsSchema, `/tv/${p.series_id}`, {
            append_to_response:
                p.append_to_response ??
                "credits,videos,recommendations,similar,watch/providers",
            language: p.language,
        });
    },

    getTvList(
        category: "airing_today" | "on_the_air" | "popular" | "top_rated",
        params: TvListParams
    ): Promise<TvListResponse> {
        const p = tvListParamsSchema.parse(params);
        return get(tvListResponseSchema, `/tv/${category}`, p);
    },

    getWatchProviderList(
        mediaType: "movie" | "tv",
        params: WatchProviderListParams
    ): Promise<WatchProviderListResponse> {
        const p = watchProviderListParamsSchema.parse(params);
        return get(
            watchProviderListResponseSchema,
            `/watch/providers/${mediaType}`,
            p
        );
    },

    searchMulti(params: SearchParams): Promise<SearchMultiResponse> {
        const p = searchParamsSchema.parse(params);
        return get(searchMultiResponseSchema, "/search/multi", p);
    },
};
