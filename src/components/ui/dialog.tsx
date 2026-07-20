"use client";

import { IconX } from "@tabler/icons-react";
import type * as React from "react";
import type { DialogTriggerProps as DialogTriggerPrimitiveProps } from "react-aria-components";
import {
    Dialog as DialogPrimitive,
    DialogTrigger as DialogTriggerPrimitive,
    Heading,
    ModalOverlay as ModalOverlayPrimitive,
    type ModalOverlayProps as ModalOverlayPrimitiveProps,
    Modal as ModalPrimitive,
} from "react-aria-components";

export type {
    DialogProps as DialogPrimitiveProps,
    DialogTriggerProps as DialogTriggerPrimitiveProps,
} from "react-aria-components";

import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";

function DialogTrigger({ ...props }: DialogTriggerPrimitiveProps) {
    return <DialogTriggerPrimitive data-slot="dialog-trigger" {...props} />;
}

function DialogClose({
    className,
    variant = "outline",
    size = "default",
    ...props
}: React.ComponentProps<typeof Button>) {
    return (
        <Button
            {...props}
            className={cn(className)}
            data-slot="dialog-close"
            size={size}
            slot="close"
            variant={variant}
        />
    );
}

function DialogOverlay({
    className,
    children,
    ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> & {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <ModalOverlayPrimitive
            {...props}
            className={cn(
                "data-entering:fade-in-0 data-exiting:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 data-entering:animate-in data-exiting:animate-out supports-backdrop-filter:backdrop-blur-xs",
                className
            )}
            data-slot="dialog-overlay"
        >
            {children}
        </ModalOverlayPrimitive>
    );
}

function Dialog({
    className,
    children,
    showCloseButton = true,
    isDismissable = true,
    ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> &
    Pick<React.ComponentProps<typeof ModalPrimitive>, "isDismissable"> & {
        className?: string;
        children: React.ReactNode;
        showCloseButton?: boolean;
    }) {
    return (
        <DialogOverlay isDismissable={isDismissable} {...props}>
            <ModalPrimitive
                className={cn(
                    "data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:fade-out-0 data-exiting:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground text-sm outline-none ring-1 ring-foreground/10 duration-100 data-entering:animate-in data-exiting:animate-out sm:max-w-sm",
                    className
                )}
                data-slot="dialog-content"
            >
                <DialogPrimitive
                    className="outline-none [display:inherit] [gap:inherit]"
                    data-slot="dialog"
                >
                    {children}
                    {!!showCloseButton && (
                        <DialogClose
                            className="absolute top-2 right-2"
                            size="icon-sm"
                            variant="ghost"
                        >
                            <IconX />
                            <span className="sr-only">Close</span>
                        </DialogClose>
                    )}
                </DialogPrimitive>
            </ModalPrimitive>
        </DialogOverlay>
    );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn("flex flex-col gap-2", className)}
            data-slot="dialog-header"
        />
    );
}

function DialogFooter({
    className,
    showCloseButton = false,
    children,
    ...props
}: React.ComponentProps<"div"> & {
    showCloseButton?: boolean;
}) {
    return (
        <div
            {...props}
            className={cn(
                "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
                className
            )}
            data-slot="dialog-footer"
        >
            {children}
            {!!showCloseButton && (
                <DialogClose variant="outline">Close</DialogClose>
            )}
        </div>
    );
}

function DialogTitle({
    className,
    ...props
}: Omit<React.ComponentProps<typeof Heading>, "slot">) {
    return (
        <Heading
            {...props}
            className={cn(
                "font-heading font-medium text-base leading-none",
                className
            )}
            data-slot="dialog-title"
            slot="title"
        />
    );
}

function DialogDescription({
    className,
    ...props
}: Omit<React.ComponentProps<"div">, "slot">) {
    return (
        <div
            {...props}
            className={cn(
                "text-muted-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
                className
            )}
            data-slot="dialog-description"
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
};
