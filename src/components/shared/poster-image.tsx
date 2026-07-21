import { IconPhotoOff } from "@tabler/icons-react";
import { cn } from "#/lib/utils";
import { buildImageUrl } from "#/schema/configuration";
import { useConfiguration } from "#/server/queries";
import { Skeleton } from "../ui/skeleton";

const POSTER_SIZE = "w342";

interface PosterImageProps {
    alt: string;
    className?: string;
    path: string | null;
}

const PosterImage = ({ alt, path, className }: PosterImageProps) => {
    const { data: config, isLoading } = useConfiguration();

    if (isLoading) {
        return (
            <Skeleton
                className={cn("aspect-2/3 w-full rounded-lg", className)}
            />
        );
    }

    const src = config ? buildImageUrl(config.images, path, POSTER_SIZE) : null;

    if (!src) {
        return (
            <div
                className={cn(
                    "flex aspect-2/3 w-full items-center justify-center rounded-lg bg-muted text-muted-foreground",
                    className
                )}
            >
                <IconPhotoOff aria-hidden="true" className="size-6" />
            </div>
        );
    }

    return (
        <img
            alt={alt}
            className={cn(
                "rouded-lg aspect-2/3 w-full object-cover",
                className
            )}
            height={513}
            loading="lazy"
            src={src}
            width={342}
        />
    );
};

export default PosterImage;
