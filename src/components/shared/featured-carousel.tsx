import { useEffect, useState } from "react";
import type { TrendingResponse } from "#/schema/trending";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
} from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

interface FeturedCarouselProps {
    isError: boolean;
    isLoading: boolean;
    media: TrendingResponse["results"];
}

const FeaturedCarousel = ({
    media,
    isLoading,
    isError,
}: FeturedCarouselProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        const onSelect = () => setCurrent(api.selectedScrollSnap());

        onSelect();
        api.on("select", onSelect);
        api.on("reInit", onSelect);

        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api]);

    if (isLoading) {
        return <Skeleton className="h-[clamp(18rem,60vw,34rem)] w-full" />;
    }

    if (isError || media.length === 0) {
        return (
            <div className="rounded-3xl border bg-muted p-6 text-muted-foreground text-sm">
                Unable to load featured titles.
            </div>
        );
    }

    return (
        <section className="w-full">
            <Carousel
                className="w-full"
                opts={{ align: "start", loop: true }}
                setApi={setApi}
            >
                <CarouselContent>
                    {media.map((item) => (
                        <CarouselItem className="basis-full" key={item.id}>
                            <article className="relative overflow-hidden rounded-3xl border bg-zinc-950 shadow-2xl">
                                <div className="relative aspect-4/5 sm:aspect-16/10 md:aspect-video">
                                    <img
                                        alt={}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        sizes="(min-width: 768px) 100vw, 100vw"
                                        src={item.backdropUrl}
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

                                    <div className="absolute inset-0 flex items-end">
                                        <div className="max-w-3xl p-4 text-white sm:p-6 md:p-10">
                                            <p className="text-[0.65rem] text-white/70 uppercase tracking-[0.28em] sm:text-xs">
                                                {item.media_type === "tv"
                                                    ? "TV series"
                                                    : "Movie"}{" "}
                                                • {item}
                                            </p>

                                            <h2 className="mt-2 font-semibold text-2xl sm:text-4xl md:text-5xl">
                                                {item.title}
                                            </h2>

                                            <p className="mt-3 line-clamp-3 max-w-2xl text-sm text-white/80 sm:text-base">
                                                {item.overview}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
};

export default FeaturedCarousel;
