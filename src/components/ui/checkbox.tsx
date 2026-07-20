import { IconCheck } from "@tabler/icons-react";
import {
    Checkbox as CheckboxPrimitive,
    type CheckboxProps,
    composeRenderProps,
} from "react-aria-components";
import { cn } from "#/lib/utils.ts";

function Checkbox({ className, children, ...props }: CheckboxProps) {
    return (
        <CheckboxPrimitive
            {...props}
            className={cn(
                "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 group-has-disabled/field:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-invalid:data-selected:border-primary data-[disabled]:cursor-not-allowed data-checked:border-primary data-focus-visible:border-ring data-invalid:border-destructive data-selected:border-primary data-checked:bg-primary data-selected:bg-primary data-checked:text-primary-foreground data-selected:text-primary-foreground data-[disabled]:opacity-50 data-focus-visible:ring-3 data-focus-visible:ring-ring/50 data-invalid:ring-3 data-invalid:ring-destructive/20 dark:bg-input/30 dark:data-invalid:border-destructive/50 dark:data-checked:bg-primary dark:data-selected:bg-primary dark:data-invalid:ring-destructive/40 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                className
            )}
            data-slot="checkbox"
        >
            {composeRenderProps(
                children,
                (renderedChildren, { isSelected, isIndeterminate }) => (
                    <>
                        <span
                            className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
                            data-slot="checkbox-indicator"
                        >
                            {!!(isSelected || isIndeterminate) && <IconCheck />}
                        </span>
                        {renderedChildren}
                    </>
                )
            )}
        </CheckboxPrimitive>
    );
}

export { Checkbox };
