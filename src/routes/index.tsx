import { createFileRoute } from "@tanstack/react-router";
import PopularSection from "#/features/movies/components/popular-section";
import { TrendingSection } from "#/features/movies/components/trending-section";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
    return (
        <div className="mx-auto max-w-6xl px-6 py-8">
            <TrendingSection />
            <PopularSection />
        </div>
    );
}
