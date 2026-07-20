"use client";

import { IconCheck, IconSearch, IconSelector } from "@tabler/icons-react";
import type * as React from "react";
import {
    Button as ButtonPrimitive,
    composeRenderProps,
    Header as HeaderPrimitive,
    ListBoxItem as ListBoxItemPrimitive,
    ListBox as ListBoxPrimitive,
    type ListBoxProps,
    ListBoxSection as ListBoxSectionPrimitive,
    Popover as PopoverPrimitive,
    SearchField,
    type SearchFieldProps,
    type ListBoxSectionProps as SelectGroupProps,
    Select as SelectPrimitive,
    type SelectProps,
    SelectValue as SelectValuePrimitive,
    type SelectValueProps,
    Separator as SeparatorPrimitive,
} from "react-aria-components";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "#/components/ui/input-group.tsx";
import { cn } from "#/lib/utils.ts";

function Select<T extends object, M extends "single" | "multiple" = "single">({
    className,
    ...props
}: SelectProps<T, M>) {
    return (
        <SelectPrimitive
            {...props}
            className={cn("w-fit", className)}
            data-slot="select"
        />
    );
}

function SelectGroup<T extends object>({
    className,
    ...props
}: SelectGroupProps<T>) {
    return (
        <ListBoxSectionPrimitive
            {...props}
            className={cn("scroll-my-1 p-1", className)}
            data-slot="select-group"
        />
    );
}

function SelectValue<T extends object>({
    className,
    children,
    ...props
}: SelectValueProps<T>) {
    return (
        <SelectValuePrimitive
            {...props}
            className={cn(
                "flex flex-1 text-left data-placeholder:text-muted-foreground",
                className
            )}
            data-slot="select-value"
        >
            {typeof children === "function"
                ? children
                : ({ selectedItems, selectedText, defaultChildren }) =>
                      selectedItems.length > 1 ? selectedText : defaultChildren}
        </SelectValuePrimitive>
    );
}

function SelectTrigger({
    className,
    size = "default",
    children,
    ...props
}: Omit<React.ComponentProps<typeof ButtonPrimitive>, "children"> & {
    children?: React.ReactNode;
    size?: "sm" | "default";
}) {
    return (
        <ButtonPrimitive
            {...props}
            className={cn(
                "flex w-full select-none items-center justify-between gap-1.5 whitespace-nowrap rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-8 data-[size=sm]:h-7 data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-placeholder:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                className
            )}
            data-size={size}
            data-slot="select-trigger"
        >
            {children}
            <IconSelector className="pointer-events-none size-4 text-muted-foreground" />
        </ButtonPrimitive>
    );
}

function SelectContent({
    className,
    children,
    placement = "bottom",
    offset = 4,
    crossOffset = 0,
    ...props
}: Omit<
    React.ComponentProps<typeof PopoverPrimitive>,
    "className" | "children"
> & {
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <SelectPopover
            className={className}
            crossOffset={crossOffset}
            offset={offset}
            placement={placement}
            {...props}
        >
            <SelectList>{children}</SelectList>
        </SelectPopover>
    );
}

function SelectPopover({
    className,
    children,
    placement = "bottom start",
    offset = 4,
    crossOffset = 0,
    ...props
}: Omit<
    React.ComponentProps<typeof PopoverPrimitive>,
    "className" | "children"
> & {
    className?: string;
    children?: React.ReactNode;
}) {
    return (
        <PopoverPrimitive
            {...props}
            className={cn(
                "data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 relative isolate z-50 w-(--trigger-width) min-w-36 origin-(--trigger-anchor-point) animate-none! overflow-hidden rounded-lg bg-popover/70 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 data-entering:animate-in data-exiting:animate-out **:data-[slot$=-item]:data-focused:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[variant=destructive]:**:text-accent-foreground! **:data-[variant=destructive]:text-accent-foreground! **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[variant=destructive]:focus:bg-foreground/10!",
                className
            )}
            crossOffset={crossOffset}
            data-slot="select-content"
            offset={offset}
            placement={placement}
        >
            {children}
        </PopoverPrimitive>
    );
}

function SelectList<T extends object>({
    className,
    ...props
}: ListBoxProps<T>) {
    return (
        <ListBoxPrimitive
            {...props}
            className={cn(
                "group/select-list max-h-[inherit] overflow-y-auto overflow-x-hidden p-0 outline-hidden",
                className
            )}
            data-slot="select-list"
        />
    );
}

function SelectInput({ className, ...props }: SearchFieldProps) {
    return (
        <SearchField
            {...props}
            autoFocus
            className={cn("p-1 pb-0", className)}
            data-slot="select-input-wrapper"
        >
            <InputGroup>
                <InputGroupInput
                    className="[&::-webkit-search-cancel-button]:hidden"
                    data-slot="select-input"
                />
                <InputGroupAddon>
                    <IconSearch className="size-4 shrink-0 opacity-50" />
                </InputGroupAddon>
            </InputGroup>
        </SearchField>
    );
}

function SelectLabel({
    className,
    ...props
}: React.ComponentProps<typeof HeaderPrimitive>) {
    return (
        <HeaderPrimitive
            {...props}
            className={cn(
                "px-1.5 py-1 text-muted-foreground text-xs",
                className
            )}
            data-slot="select-label"
        />
    );
}

function SelectItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof ListBoxItemPrimitive>) {
    return (
        <ListBoxItemPrimitive
            {...props}
            className={cn(
                "relative flex w-full cursor-default select-none items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-focused:bg-accent data-focused:text-accent-foreground data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
                className
            )}
            data-slot="select-item"
            textValue={typeof children === "string" ? children : undefined}
        >
            {composeRenderProps(
                children,
                (renderedChildren, { isSelected }) => (
                    <>
                        <span className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
                            {renderedChildren}
                        </span>
                        <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                            {isSelected ? (
                                <IconCheck className="pointer-events-none" />
                            ) : null}
                        </span>
                    </>
                )
            )}
        </ListBoxItemPrimitive>
    );
}

function SelectSeparator({
    className,
    ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
    return (
        <SeparatorPrimitive
            {...props}
            className={cn(
                "pointer-events-none -mx-1 my-1 h-px bg-border",
                className
            )}
            data-slot="select-separator"
        />
    );
}

function SelectEmpty({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn(
                "hidden w-full justify-center py-2 text-center text-muted-foreground text-sm group-data-empty/select-list:flex",
                className
            )}
            data-slot="select-empty"
        />
    );
}

export {
    Select,
    SelectContent,
    SelectEmpty,
    SelectGroup,
    SelectInput,
    SelectItem,
    SelectLabel,
    SelectList,
    SelectPopover,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
};
