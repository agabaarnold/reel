import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Link as LinkPrimitive, type LinkProps } from "react-aria-components";
import { Separator } from "#/components/ui/separator.tsx";
import { cn } from "#/lib/utils.ts";

function ItemGroup({ className, ...props }: React.ComponentProps<"ul">) {
    return (
        <ul
            {...props}
            className={cn(
                "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
                className
            )}
            data-slot="item-group"
        />
    );
}

function ItemSeparator({
    className,
    ...props
}: React.ComponentProps<typeof Separator>) {
    return (
        <Separator
            {...props}
            className={cn("my-2", className)}
            data-slot="item-separator"
            orientation="horizontal"
        />
    );
}

const itemVariants = cva(
    "group/item flex w-full flex-wrap items-center rounded-lg border text-sm outline-none transition-colors duration-100 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted",
    {
        defaultVariants: {
            size: "default",
            variant: "default",
        },
        variants: {
            size: {
                default: "gap-2.5 px-3 py-2.5",
                sm: "gap-2.5 px-3 py-2.5",
                xs: "gap-2 in-data-[slot=dropdown-menu-content]:p-0 px-2.5 py-2",
            },
            variant: {
                default: "border-transparent",
                muted: "border-transparent bg-muted/50",
                outline: "border-border",
            },
        },
    }
);

function Item({
    className,
    variant = "default",
    size = "default",
    ...props
}: Omit<LinkProps, "children"> &
    React.HTMLAttributes<HTMLElement> &
    VariantProps<typeof itemVariants>) {
    const Element = "href" in props ? LinkPrimitive : "div";
    return (
        <Element
            {...props}
            className={cn(itemVariants({ className, size, variant }))}
            data-size={size}
            data-slot="item"
            data-variant={variant}
        />
    );
}

const itemMediaVariants = cva(
    "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
    {
        defaultVariants: {
            variant: "default",
        },
        variants: {
            variant: {
                default: "bg-transparent",
                icon: "[&_svg:not([class*='size-'])]:size-4",
                image: "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
            },
        },
    }
);

function ItemMedia({
    className,
    variant = "default",
    ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
    return (
        <div
            {...props}
            className={cn(itemMediaVariants({ className, variant }))}
            data-slot="item-media"
            data-variant={variant}
        />
    );
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
                className
            )}
            data-slot="item-content"
        />
    );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                "line-clamp-1 flex w-fit items-center gap-2 font-medium text-sm leading-snug underline-offset-4",
                className
            )}
            data-slot="item-title"
        />
    );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
    return (
        <p
            {...props}
            className={cn(
                "line-clamp-2 text-left font-normal text-muted-foreground text-sm leading-normal group-data-[size=xs]/item:text-xs [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
                className
            )}
            data-slot="item-description"
        />
    );
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn("flex items-center gap-2", className)}
            data-slot="item-actions"
        />
    );
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                "flex basis-full items-center justify-between gap-2",
                className
            )}
            data-slot="item-header"
        />
    );
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                "flex basis-full items-center justify-between gap-2",
                className
            )}
            data-slot="item-footer"
        />
    );
}

export {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemGroup,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
    ItemTitle,
};
