import { IconX } from "@tabler/icons-react";
import type * as React from "react";
import {
    Heading,
    ModalOverlay as ModalOverlayPrimitive,
    type ModalOverlayProps as ModalOverlayPrimitiveProps,
    Modal as ModalPrimitive,
    Dialog as SheetPrimitive,
    DialogTrigger as SheetTriggerPrimitive,
} from "react-aria-components";
import { Button } from "#/components/ui/button.tsx";
import { cn } from "#/lib/utils.ts";

function SheetTrigger({
    ...props
}: React.ComponentProps<typeof SheetTriggerPrimitive>) {
    return <SheetTriggerPrimitive data-slot="sheet-trigger" {...props} />;
}

function SheetClose({
    className,
    variant = "outline",
    size = "default",
    ...props
}: React.ComponentProps<typeof Button>) {
    return (
        <Button
            {...props}
            className={cn(className)}
            data-slot="sheet-close"
            size={size}
            slot="close"
            variant={variant}
        />
    );
}

function SheetOverlay({
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
                "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-entering:opacity-0 data-exiting:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
                className
            )}
            data-slot="sheet-overlay"
            isDismissable
        >
            {children}
        </ModalOverlayPrimitive>
    );
}

function Sheet({
    className,
    children,
    side = "right",
    showCloseButton = true,
    ...props
}: Omit<ModalOverlayPrimitiveProps, "className" | "children"> &
    Pick<React.ComponentProps<typeof ModalPrimitive>, "isDismissable"> & {
        className?: string;
        children: React.ReactNode;
        side?: "top" | "right" | "bottom" | "left";
        showCloseButton?: boolean;
    }) {
    return (
        <SheetOverlay {...props}>
            <ModalPrimitive
                className={cn(
                    "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-popover-foreground text-sm shadow-lg transition duration-200 ease-in-out data-[side=left]:data-entering:translate-x-[-2.5rem] data-[side=left]:data-exiting:translate-x-[-2.5rem] data-[side=right]:data-entering:translate-x-[2.5rem] data-[side=right]:data-exiting:translate-x-[2.5rem] data-[side=bottom]:data-entering:translate-y-[2.5rem] data-[side=bottom]:data-exiting:translate-y-[2.5rem] data-[side=top]:data-entering:translate-y-[-2.5rem] data-[side=top]:data-exiting:translate-y-[-2.5rem] data-[side=bottom]:inset-x-0 data-[side=top]:inset-x-0 data-[side=left]:inset-y-0 data-[side=right]:inset-y-0 data-[side=top]:top-0 data-[side=right]:right-0 data-[side=bottom]:bottom-0 data-[side=left]:left-0 data-[side=bottom]:h-auto data-[side=left]:h-full data-[side=right]:h-full data-[side=top]:h-auto data-[side=left]:w-3/4 data-[side=right]:w-3/4 data-[side=bottom]:border-t data-[side=left]:border-r data-[side=top]:border-b data-[side=right]:border-l data-entering:opacity-0 data-exiting:opacity-0 data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
                    className
                )}
                data-side={side}
                data-slot="sheet-content"
            >
                <SheetPrimitive
                    className="h-full max-h-[inherit] outline-none [display:inherit] [flex-direction:inherit] [gap:inherit]"
                    data-slot="sheet"
                >
                    {children}
                    {!!showCloseButton && (
                        <SheetClose
                            className="absolute top-3 right-3"
                            size="icon-sm"
                            variant="ghost"
                        >
                            <IconX />
                            <span className="sr-only">Close</span>
                        </SheetClose>
                    )}
                </SheetPrimitive>
            </ModalPrimitive>
        </SheetOverlay>
    );
}

function SheetContent({
    className,
    children,
    side = "right",
    showCloseButton = true,
    ...props
}: React.ComponentProps<typeof Sheet> & {
    side?: "top" | "right" | "bottom" | "left";
    showCloseButton?: boolean;
}) {
    return (
        <Sheet
            {...props}
            className={className}
            showCloseButton={showCloseButton}
            side={side}
        >
            {children}
        </Sheet>
    );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn("flex flex-col gap-0.5 p-4", className)}
            data-slot="sheet-header"
        />
    );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            {...props}
            className={cn("mt-auto flex flex-col gap-2 p-4", className)}
            data-slot="sheet-footer"
        />
    );
}

function SheetTitle({
    className,
    ...props
}: Omit<React.ComponentProps<typeof Heading>, "slot">) {
    return (
        <Heading
            {...props}
            className={cn(
                "font-heading font-medium text-base text-foreground",
                className
            )}
            data-slot="sheet-title"
            slot="title"
        />
    );
}

function SheetDescription({
    className,
    ...props
}: Omit<React.ComponentProps<"div">, "slot">) {
    return (
        <div
            {...props}
            className={cn("text-muted-foreground text-sm", className)}
            data-slot="sheet-description"
        />
    );
}

export type {
    DialogProps as SheetPrimitiveProps,
    DialogTriggerProps as SheetTriggerPrimitiveProps,
} from "react-aria-components";

export {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
};
