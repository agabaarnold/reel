"use client";

import type * as React from "react";

import { cn } from "#/lib/utils.ts";

function ScrollArea({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    // Use native scrollbar-width and scrollbar-color to customize the scrollbar.
    return (
        <div
            {...props}
            className={cn(
                "relative overflow-auto outline-none [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin] focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                className
            )}
            data-slot="scroll-area"
        >
            {children}
        </div>
    );
}

export { ScrollArea };
