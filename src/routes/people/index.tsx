import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PersonCard } from "#/features/home/components/media-cards";
import type { TrendingItem } from "#/schema/trending";
import {
    configurationOptions,
    trendingOptions,
    useTrending,
} from "#/server/queries";

const peopleSearchSchema = z.object({
    page: z.number().int().positive().default(1).catch(1),
});

export const Route = createFileRoute("/people/")({
    component: PeoplePage,
    loader: async ({ context, deps }) => {
        await Promise.all([
            context.queryClient.prefetchQuery(configurationOptions()),
            context.queryClient.prefetchQuery(
                trendingOptions({
                    media_type: "person",
                    page: deps.page,
                    time_window: "week",
                })
            ),
        ]);
    },
    loaderDeps: ({ search }) => search,
    validateSearch: peopleSearchSchema,
});

function isPerson(item: TrendingItem) {
    return item.media_type === "person";
}

function PeoplePage() {
    const { page } = Route.useLoaderDeps();
    const { data } = useTrending({
        media_type: "person",
        page,
        time_window: "week",
    });
    const people = data.results.filter(isPerson);

    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h1 className="font-heading font-semibold text-3xl">
                Trending people
            </h1>
            <p className="mt-3 text-muted-foreground">
                Explore people currently trending on Reel.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {people.map((person) => (
                    <PersonCard key={person.id} person={person} />
                ))}
            </div>
        </main>
    );
}
