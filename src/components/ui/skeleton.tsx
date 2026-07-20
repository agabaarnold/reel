import { cn } from "#/lib/utils.ts";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn("animate-pulse rounded-md bg-muted", className)}
            data-slot="skeleton"
        />
    );
}

export { Skeleton };
