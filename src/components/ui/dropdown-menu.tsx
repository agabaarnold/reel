import { IconCheck, IconChevronRight } from "@tabler/icons-react";
import { cva } from "class-variance-authority";
import type * as React from "react";
import {
    composeRenderProps,
    Header as HeaderPrimitive,
    MenuItem as MenuItemPrimitive,
    type MenuItemProps as MenuItemPrimitiveProps,
    Menu as MenuPrimitive,
    MenuSection as MenuSectionPrimitive,
    type MenuSectionProps as MenuSectionPrimitiveProps,
    MenuTrigger as MenuTriggerPrimitive,
    Popover as PopoverPrimitive,
    Separator as SeparatorPrimitive,
    SubmenuTrigger as SubmenuTriggerPrimitive,
} from "react-aria-components";
import { cn } from "#/lib/utils.ts";

function DropdownMenuTrigger({
    ...props
}: React.ComponentProps<typeof MenuTriggerPrimitive>) {
    return (
        <MenuTriggerPrimitive data-slot="dropdown-menu-trigger" {...props} />
    );
}

function DropdownMenu({
    "data-slot": dataSlot = "dropdown-menu-content",
    placement = "bottom start",
    offset = 4,
    crossOffset = 0,
    className,
    children,
    ...props
}: Omit<
    React.ComponentProps<typeof MenuPrimitive<object>>,
    "children" | "className"
> &
    Pick<
        React.ComponentProps<typeof PopoverPrimitive>,
        "placement" | "offset" | "crossOffset"
    > & {
        "data-slot"?: string;
        className?: string;
        children?: React.ReactNode;
    }) {
    return (
        <PopoverPrimitive
            className={cn(
                "data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 relative z-50 w-(--trigger-width) min-w-32 origin-(--trigger-anchor-point) animate-none! overflow-y-auto overflow-x-hidden rounded-lg bg-popover/70 p-1 text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10 duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 data-entering:animate-in data-exiting:animate-out data-exiting:overflow-hidden **:data-[slot$=-item]:data-focused:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[variant=destructive]:**:text-accent-foreground! **:data-[variant=destructive]:text-accent-foreground! **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[variant=destructive]:focus:bg-foreground/10!",
                className
            )}
            crossOffset={crossOffset}
            data-slot={dataSlot}
            offset={offset}
            placement={placement}
        >
            <MenuPrimitive
                className="max-h-[inherit] overflow-y-auto overflow-x-hidden outline-hidden"
                {...props}
            >
                {children}
            </MenuPrimitive>
        </PopoverPrimitive>
    );
}

function DropdownMenuGroup({
    ...props
}: Omit<MenuSectionPrimitiveProps<object>, "children"> & {
    children?: React.ReactNode;
}) {
    return <MenuSectionPrimitive data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof HeaderPrimitive> & {
    inset?: boolean;
}) {
    return (
        <HeaderPrimitive
            {...props}
            className={cn(
                "px-1.5 py-1 font-medium text-muted-foreground text-xs data-inset:pl-7",
                className
            )}
            data-inset={inset}
            data-slot="dropdown-menu-label"
        />
    );
}

const dropdownMenuItemVariants = cva(
    "group/dropdown-menu-item relative flex cursor-default select-none items-center outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
        variants: {
            selectionMode: {
                multiple:
                    "gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4",
                none: "gap-1.5 rounded-md px-1.5 py-1 text-sm focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
                single: "gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 [&_svg:not([class*='size-'])]:size-4",
            },
        },
    }
);

function DropdownMenuItem({
    className,
    inset,
    variant = "default",
    children,
    ...props
}: MenuItemPrimitiveProps<object> & {
    inset?: boolean;
    variant?: "default" | "destructive";
}) {
    return (
        <MenuItemPrimitive
            {...props}
            className={composeRenderProps(
                className,
                (renderClassName, { selectionMode }) =>
                    cn(
                        dropdownMenuItemVariants({ selectionMode }),
                        renderClassName
                    )
            )}
            data-inset={inset}
            data-slot="dropdown-menu-item"
            data-variant={variant}
            textValue={
                typeof children === "string" ? children : props.textValue
            }
        >
            {composeRenderProps(
                children,
                (renderedChildren, { isSelected, selectionMode }) => (
                    <>
                        {selectionMode === "none" ? null : (
                            <span
                                className="pointer-events-none absolute right-2 flex items-center justify-center"
                                data-slot={
                                    selectionMode === "single"
                                        ? "dropdown-menu-radio-item-indicator"
                                        : "dropdown-menu-checkbox-item-indicator"
                                }
                            >
                                {isSelected ? <IconCheck /> : null}
                            </span>
                        )}
                        {renderedChildren}
                    </>
                )
            )}
        </MenuItemPrimitive>
    );
}

function DropdownMenuSub({
    ...props
}: React.ComponentProps<typeof SubmenuTriggerPrimitive>) {
    return <SubmenuTriggerPrimitive data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: MenuItemPrimitiveProps<object> & {
    inset?: boolean;
}) {
    return (
        <MenuItemPrimitive
            {...props}
            className={cn(
                "flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-open:bg-accent data-inset:pl-7 data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className
            )}
            data-inset={inset}
            data-slot="dropdown-menu-sub-trigger"
            textValue={
                typeof children === "string" ? children : props.textValue
            }
        >
            {composeRenderProps(children, (renderedChildren) => (
                <>
                    {renderedChildren}
                    <IconChevronRight className="ml-auto" />
                </>
            ))}
        </MenuItemPrimitive>
    );
}

function DropdownMenuSubContent({
    placement = "end top",
    crossOffset = -3,
    offset = 0,
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenu>) {
    return (
        <DropdownMenu
            {...props}
            className={cn(
                "relative w-auto min-w-[96px] animate-none! rounded-lg bg-popover/70 p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[variant=destructive]:**:text-accent-foreground! **:data-[variant=destructive]:text-accent-foreground! **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[variant=destructive]:focus:bg-foreground/10!",
                className
            )}
            crossOffset={crossOffset}
            data-slot="dropdown-menu-sub-content"
            offset={offset}
            placement={placement}
        />
    );
}

function DropdownMenuSeparator({
    className,
    ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
    return (
        <SeparatorPrimitive
            {...props}
            className={cn("-mx-1 my-1 h-px bg-border", className)}
            data-slot="dropdown-menu-separator"
        />
    );
}

function DropdownMenuShortcut({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            {...props}
            className={cn(
                "ml-auto text-muted-foreground text-xs tracking-widest group-focus/dropdown-menu-item:text-accent-foreground",
                className
            )}
            data-slot="dropdown-menu-shortcut"
        />
    );
}

export {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
};
