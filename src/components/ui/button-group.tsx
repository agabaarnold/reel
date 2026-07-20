import { cva, type VariantProps } from "class-variance-authority";
import { Separator } from "#/components/ui/separator.tsx";
import { cn } from "#/lib/utils.ts";

const buttonGroupVariants = cva(
    "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
    {
        defaultVariants: {
            orientation: "horizontal",
        },
        variants: {
            orientation: {
                horizontal:
                    "**:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg! [&_[data-slot]~[data-slot]]:rounded-l-none [&_[data-slot]~[data-slot]]:border-l-0",
                vertical:
                    "flex-col **:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! [&_[data-slot]~[data-slot]]:rounded-t-none [&_[data-slot]~[data-slot]]:border-t-0",
            },
        },
    }
);

function ButtonGroup({
    className,
    orientation,
    ...props
}: React.ComponentProps<"fieldset"> &
    VariantProps<typeof buttonGroupVariants>) {
    return (
        <fieldset
            {...props}
            className={cn(buttonGroupVariants({ orientation }), className)}
            data-orientation={orientation}
            data-slot="button-group"
        />
    );
}

function ButtonGroupText({
    className,
    render,
    ...props
}: React.ComponentProps<"div"> & {
    render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode;
}) {
    if (render) {
        const renderProps = {
            className: cn(
                "flex items-center gap-2 rounded-lg border bg-muted px-2.5 font-medium text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
                className
            ),
            "data-slot": "button-group-text",
            ...props,
        };

        return render(renderProps);
    }

    return (
        <div
            {...props}
            className={cn(
                "flex items-center gap-2 rounded-lg border bg-muted px-2.5 font-medium text-sm [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
                className
            )}
            data-slot="button-group-text"
        />
    );
}

function ButtonGroupSeparator({
    className,
    orientation = "vertical",
    ...props
}: React.ComponentProps<typeof Separator>) {
    return (
        <Separator
            {...props}
            className={cn(
                "relative self-stretch bg-input data-horizontal:mx-px data-vertical:my-px data-vertical:h-auto data-horizontal:w-auto",
                className
            )}
            data-slot="button-group-separator"
            orientation={orientation}
        />
    );
}

export {
    ButtonGroup,
    ButtonGroupSeparator,
    ButtonGroupText,
    buttonGroupVariants,
};
