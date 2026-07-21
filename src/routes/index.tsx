import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import FeaturedCarousel from "#/components/shared/featured-carousel";
import { trendingOptions, useTrending } from "#/server/queries";

const homeSearchSchema = z.object({
    page: z.number().int().positive().default(1),
    timeWindow: z.enum(["day", "week"]).default("day"),
});

// biome-ignore assist/source/useSortedKeys: Thats the expected order
export const Route = createFileRoute("/")({
    component: Home,
    loaderDeps: ({ search }) => search,
    loader: async ({ context, deps }) => {
        const { queryClient } = context;
        await Promise.all([
            queryClient.prefetchQuery(
                trendingOptions({
                    media_type: "all",
                    page: deps.page,
                    time_window: deps.timeWindow,
                })
            ),
        ]);
    },
    validateSearch: homeSearchSchema,
});

function Home() {
    const { page, timeWindow } = Route.useLoaderDeps();
    const { data, isLoading, isError } = useTrending({
        media_type: "all",
        page,
        time_window: timeWindow,
    });

    const trending = data.results;

    return (
        <div className="">
            <FeaturedCarousel
                isError={isError}
                isLoading={isLoading}
                media={trending}
            />
        </div>
    );
}
