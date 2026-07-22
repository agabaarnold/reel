import { IconPhotoOff } from "@tabler/icons-react";
import { cn } from "#/lib/utils";
import { buildImageUrl } from "#/schema/configuration";
import { useConfiguration } from "#/server/queries";

const IMAGE_VARIANTS = {
    poster: {
        aspectRatio: "aspect-2/3",
        size: "w342",
    },
    profile: {
        aspectRatio: "aspect-square",
        size: "w185",
    },
} as const;

interface PosterImageProps {
    alt: string;
    className?: string;
    path: string | null;
    variant?: keyof typeof IMAGE_VARIANTS;
}

const PosterImage = ({
    alt,
    path,
    className,
    variant = "poster",
}: PosterImageProps) => {
    const { data: config } = useConfiguration();
    const imageVariant = IMAGE_VARIANTS[variant];

    const src = config
        ? buildImageUrl(config.images, path, imageVariant.size)
        : null;

    if (!src) {
        return (
            <div
                className={cn(
                    "flex w-full items-center justify-center rounded-lg bg-muted text-muted-foreground",
                    imageVariant.aspectRatio,
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
                "w-full rounded-lg object-cover",
                imageVariant.aspectRatio,
                className
            )}
            height={imageVariant.height}
            loading="lazy"
            src={src}
            width={imageVariant.width}
        />
    );
};

export default PosterImage;
