import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ContentRow } from "#/features/home/components/content-row";
import {
    MovieCard,
    PersonCard,
    TvCard,
} from "#/features/home/components/media-cards";
import type { SearchMultiItem } from "#/schema/search";
import { searchMultiOptions, useSearchMulti } from "#/server/queries";

const searchSchema = z.object({
    q: z.string().trim().default("").catch(""),
});

export const Route = createFileRoute("/search")({
    component: SearchPage,
    loader: async ({ context, deps }) => {
        if (!deps.q) {
            return;
        }

        await context.queryClient.ensureQueryData(
            searchMultiOptions({ query: deps.q })
        );
    },
    loaderDeps: ({ search }) => search,
    validateSearch: searchSchema,
});

function isMovieResult(
    item: SearchMultiItem
): item is Extract<SearchMultiItem, { media_type: "movie" }> {
    return item.media_type === "movie";
}

function isTvResult(
    item: SearchMultiItem
): item is Extract<SearchMultiItem, { media_type: "tv" }> {
    return item.media_type === "tv";
}

function isPersonResult(
    item: SearchMultiItem
): item is Extract<SearchMultiItem, { media_type: "person" }> {
    return item.media_type === "person";
}

function SearchPage() {
    const { q } = Route.useSearch();

    if (!q) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="font-heading font-semibold text-3xl">Search</h1>
                <p className="mt-3 text-muted-foreground">
                    Search for movies, TV shows, and people using the search
                    bar.
                </p>
            </main>
        );
    }

    return <SearchResults query={q} />;
}

function SearchResults({ query }: { query: string }) {
    const {
        data: { results },
    } = useSearchMulti({ query });
    const movies = results.filter(isMovieResult);
    const series = results.filter(isTvResult);
    const people = results.filter(isPersonResult);

    if (!results.length) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="font-heading font-semibold text-3xl">
                    Results for “{query}”
                </h1>
                <p className="mt-3 text-muted-foreground">
                    No movies, TV shows, or people matched your search.
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="font-heading font-semibold text-3xl">
                Results for “{query}”
            </h1>

            <div className="mt-10 flex flex-col gap-12">
                {movies.length ? (
                    <ContentRow id="search-movies" title="Movies">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </ContentRow>
                ) : null}

                {series.length ? (
                    <ContentRow id="search-series" title="TV shows">
                        {series.map((seriesItem) => (
                            <TvCard key={seriesItem.id} series={seriesItem} />
                        ))}
                    </ContentRow>
                ) : null}

                {people.length ? (
                    <ContentRow id="search-people" title="People">
                        {people.map((person) => (
                            <PersonCard key={person.id} person={person} />
                        ))}
                    </ContentRow>
                ) : null}
            </div>
        </main>
    );
}
