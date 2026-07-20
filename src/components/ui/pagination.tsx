import {
    IconChevronLeft,
    IconChevronRight,
    IconDots,
} from "@tabler/icons-react";
import type * as React from "react";
import { LinkButton } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
    return (
        <nav
            {...props}
            aria-label="pagination"
            className={cn("mx-auto flex w-full justify-center", className)}
            data-slot="pagination"
        />
    );
}

function PaginationContent({
    className,
    ...props
}: React.ComponentProps<"ul">) {
    return (
        <ul
            {...props}
            className={cn("flex items-center gap-0.5", className)}
            data-slot="pagination-content"
        />
    );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
    return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
    isActive?: boolean;
} & Omit<React.ComponentProps<typeof LinkButton>, "variant">;

function PaginationLink({
    className,
    isActive,
    size = "icon",
    ...props
}: PaginationLinkProps) {
    return (
        <LinkButton
            {...props}
            aria-current={isActive ? "page" : undefined}
            className={cn(className)}
            data-active={isActive}
            data-slot="pagination-link"
            size={size}
            variant={isActive ? "outline" : "ghost"}
        />
    );
}

function PaginationPrevious({
    className,
    text = "Previous",
    ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
    return (
        <PaginationLink
            {...props}
            aria-label="Go to previous page"
            className={cn("pl-1.5!", className)}
            size="default"
        >
            <IconChevronLeft data-icon="inline-start" />
            <span className="hidden sm:block">{text}</span>
        </PaginationLink>
    );
}

function PaginationNext({
    className,
    text = "Next",
    ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
    return (
        <PaginationLink
            {...props}
            aria-label="Go to next page"
            className={cn("pr-1.5!", className)}
            size="default"
        >
            <span className="hidden sm:block">{text}</span>
            <IconChevronRight data-icon="inline-end" />
        </PaginationLink>
    );
}

function PaginationEllipsis({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            {...props}
            aria-hidden
            className={cn(
                "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            data-slot="pagination-ellipsis"
        >
            <IconDots />
            <span className="sr-only">More pages</span>
        </span>
    );
}

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
};
