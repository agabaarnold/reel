import { IconLoader } from "@tabler/icons-react";
import { cn } from "#/lib/utils.ts";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <IconLoader
            {...props}
            aria-label="Loading"
            className={cn("size-4 animate-spin", className)}
            data-slot="spinner"
            role="status"
        />
    );
}

export { Spinner };
