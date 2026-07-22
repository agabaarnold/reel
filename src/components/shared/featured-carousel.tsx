import { IconPhotoOff } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { buildImageUrl } from "#/schema/configuration";
import type { TrendingItem, TrendingResponse } from "#/schema/trending";
import { useConfiguration } from "#/server/queries";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

const BACKDROP_HEIGHT = 720;
const BACKDROP_SIZE = "w1280";
const BACKDROP_WIDTH = 1280;
const AUTOPLAY_DELAY_MS = 10_000;

type FeaturedMedia = Extract<TrendingItem, { media_type: "movie" | "tv" }>;

interface FeaturedCarouselProps {
    isError: boolean;
    isLoading: boolean;
    media: TrendingResponse["results"];
}

const isFeaturedMedia = (item: TrendingItem): item is FeaturedMedia =>
    item.media_type === "movie" || item.media_type === "tv";

const getFeaturedTitle = (item: FeaturedMedia): string =>
    item.media_type === "movie" ? item.title : item.name;

const getFeaturedYear = (item: FeaturedMedia): string =>
    (item.media_type === "movie"
        ? item.release_date
        : item.first_air_date
    ).slice(0, 4);

interface CarouselIndicatorProps {
    api: CarouselApi | undefined;
    current: number;
    index: number;
    item: FeaturedMedia;
}

const CarouselIndicator = ({
    api,
    current,
    index,
    item,
}: CarouselIndicatorProps) => {
    const handleClick = useCallback(() => {
        api?.scrollTo(index);
    }, [api, index]);

    return (
        <button
            aria-current={index === current ? "true" : undefined}
            aria-label={`Go to slide ${index + 1}: ${getFeaturedTitle(item)}`}
            className="size-2 rounded-full bg-muted-foreground/40 transition-colors aria-current:bg-foreground"
            onClick={handleClick}
            type="button"
        />
    );
};

const FeaturedCarousel = ({
    media,
    isLoading,
    isError,
}: FeaturedCarouselProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const { data: configuration } = useConfiguration();
    const featuredMedia = media.filter(isFeaturedMedia);

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

    useEffect(() => {
        if (!(api && featuredMedia.length > 1)) {
            return;
        }

        const autoplayInterval = window.setInterval(() => {
            api.scrollNext();
        }, AUTOPLAY_DELAY_MS);

        return () => window.clearInterval(autoplayInterval);
    }, [api, featuredMedia.length]);

    if (isLoading) {
        return <Skeleton className="h-[clamp(18rem,60vw,34rem)] w-full" />;
    }

    if (isError || featuredMedia.length === 0) {
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
                    {featuredMedia.map((item) => {
                        const backdropUrl = buildImageUrl(
                            configuration.images,
                            item.backdrop_path,
                            BACKDROP_SIZE
                        );
                        const title = getFeaturedTitle(item);
                        const year = getFeaturedYear(item);

                        return (
                            <CarouselItem
                                className="basis-full"
                                key={`${item.media_type}-${item.id}`}
                            >
                                <article className="relative overflow-hidden border bg-zinc-950 shadow-2xl">
                                    <div className="relative h-[calc(100svh-7rem)] min-h-72">
                                        {backdropUrl ? (
                                            <>
                                                <img
                                                    alt=""
                                                    aria-hidden="true"
                                                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-90 blur-2xl"
                                                    height={BACKDROP_HEIGHT}
                                                    sizes="100vw"
                                                    src={backdropUrl}
                                                    width={BACKDROP_WIDTH}
                                                />
                                                <img
                                                    alt={`Backdrop for ${title}`}
                                                    className="absolute inset-0 h-full w-full object-contain"
                                                    height={BACKDROP_HEIGHT}
                                                    sizes="100vw"
                                                    src={backdropUrl}
                                                    width={BACKDROP_WIDTH}
                                                />
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                                                <IconPhotoOff aria-hidden="true" />
                                                <span className="sr-only">
                                                    No backdrop available for{" "}
                                                    {title}
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />

                                        <div className="absolute inset-0 flex items-end">
                                            <div className="max-w-3xl p-4 text-white sm:p-6 md:p-10">
                                                <p className="text-[0.65rem] text-white/70 uppercase tracking-[0.28em] sm:text-xs">
                                                    {item.media_type === "tv"
                                                        ? "TV series"
                                                        : "Movie"}{" "}
                                                    • {year || "TBA"}
                                                </p>

                                                <h2 className="mt-2 font-semibold text-2xl sm:text-4xl md:text-5xl">
                                                    {item.media_type ===
                                                    "movie" ? (
                                                        <Link
                                                            className="hover:text-primary-foreground/80 focus-visible:outline-2 focus-visible:outline-primary-foreground"
                                                            params={{
                                                                movieId:
                                                                    item.id,
                                                            }}
                                                            to="/movie/$movieId"
                                                        >
                                                            {title}
                                                        </Link>
                                                    ) : (
                                                        <Link
                                                            className="hover:text-primary-foreground/80 focus-visible:outline-2 focus-visible:outline-primary-foreground"
                                                            params={{
                                                                seriesId:
                                                                    item.id,
                                                            }}
                                                            to="/tv/$seriesId"
                                                        >
                                                            {title}
                                                        </Link>
                                                    )}
                                                </h2>

                                                <p className="mt-3 line-clamp-3 max-w-2xl text-sm text-white/80 sm:text-base">
                                                    {item.overview}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>

                <CarouselPrevious className="left-3" />
                <CarouselNext className="right-3" />
            </Carousel>

            <fieldset className="mt-4 flex justify-center gap-2">
                <legend className="sr-only">Choose a featured title</legend>

                {featuredMedia.map((item, index) => (
                    <CarouselIndicator
                        api={api}
                        current={current}
                        index={index}
                        item={item}
                        key={`${item.media_type}-${item.id}`}
                    />
                ))}
            </fieldset>

            <p aria-live="polite" className="sr-only">
                Slide {current + 1} of {featuredMedia.length}
            </p>
        </section>
    );
};

export default FeaturedCarousel;
