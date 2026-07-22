import type { ReactNode } from "react";

interface ContentRowProps {
    children: ReactNode;
    id: string;
    title: string;
}

export function ContentRow({ children, id, title }: ContentRowProps) {
    return (
        <section aria-labelledby={id}>
            <h2 className="font-heading font-semibold text-2xl" id={id}>
                {title}
            </h2>

            <div className="scrollbar-none mt-4 flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {children}
            </div>
        </section>
    );
}
