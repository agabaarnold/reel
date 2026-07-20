import {
    LabelContext,
    Label as LabelPrimitive,
    type LabelProps,
} from "react-aria-components";

import { cn } from "#/lib/utils.ts";

function Label({ className, htmlFor, slot, ...props }: LabelProps) {
    const label = (
        <LabelPrimitive
            {...props}
            className={cn(
                "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-data-disabled:opacity-50",
                className
            )}
            data-slot="label"
            htmlFor={htmlFor}
            slot={slot}
        />
    );

    if (htmlFor && slot === undefined) {
        return (
            <LabelContext.Provider value={null}>{label}</LabelContext.Provider>
        );
    }

    return label;
}

export { Label };
