import {
    type ComponentProps,
    createContext,
    type ReactNode,
    useContext,
    useMemo,
} from "react";
import {
    Label as LabelPrimitive,
    type LabelProps,
    ProgressBar as ProgressPrimitive,
    type ProgressBarProps as ProgressPrimitiveProps,
} from "react-aria-components";

import { cn } from "#/lib/utils.ts";

interface ProgressContextValue {
    isIndeterminate: boolean;
    percentage?: number;
    valueText?: string;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function useProgress() {
    const context = useContext(ProgressContext);
    if (!context) {
        throw new Error("useProgress must be used within a Progress.");
    }

    return context;
}

function ProgressContent({
    children,
    percentage,
    isIndeterminate,
    valueText,
}: ProgressContextValue & {
    children?: ReactNode;
}) {
    const context = useMemo(
        () => ({ isIndeterminate, percentage, valueText }),
        [percentage, isIndeterminate, valueText]
    );

    return (
        <ProgressContext value={context}>
            {children}
            <ProgressTrack>
                <ProgressIndicator />
            </ProgressTrack>
        </ProgressContext>
    );
}

function Progress({
    className,
    children,
    ...props
}: Omit<ProgressPrimitiveProps, "children" | "className"> & {
    children?: ReactNode;
    className?: string;
}) {
    return (
        <ProgressPrimitive
            {...props}
            className={cn("flex flex-wrap gap-3", className)}
            data-slot="progress"
        >
            {({ percentage, valueText, isIndeterminate }) => (
                <ProgressContent
                    isIndeterminate={isIndeterminate}
                    percentage={percentage}
                    valueText={valueText}
                >
                    {children}
                </ProgressContent>
            )}
        </ProgressPrimitive>
    );
}

function ProgressTrack({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            {...props}
            className={cn(
                "relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
                className
            )}
            data-slot="progress-track"
        />
    );
}

function ProgressIndicator({
    className,
    style,
    ...props
}: ComponentProps<"span">) {
    const { percentage, isIndeterminate } = useProgress();

    return (
        <span
            {...props}
            className={cn("h-full bg-primary transition-all", className)}
            data-slot="progress-indicator"
            style={{
                ...style,
                width: `${isIndeterminate ? 100 : (percentage ?? 0)}%`,
            }}
        />
    );
}

function ProgressLabel({ className, ...props }: LabelProps) {
    return (
        <LabelPrimitive
            {...props}
            className={cn("font-medium text-sm", className)}
            data-slot="progress-label"
        />
    );
}

function ProgressValue({
    className,
    children,
    ...props
}: Omit<ComponentProps<"span">, "children"> & {
    children?: (value: string) => ReactNode;
}) {
    const { valueText } = useProgress();
    return (
        <span
            {...props}
            className={cn(
                "ml-auto text-muted-foreground text-sm tabular-nums",
                className
            )}
            data-slot="progress-value"
        >
            {children && valueText !== undefined
                ? children(valueText)
                : (valueText ?? null)}
        </span>
    );
}

export {
    Progress,
    ProgressIndicator,
    ProgressLabel,
    ProgressTrack,
    ProgressValue,
};
