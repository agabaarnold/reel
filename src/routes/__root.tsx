import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
    createRootRouteWithContext,
    HeadContent,
    Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "react-hot-toast";
import Header from "#/components/shared/header";
import { ThemeProvider } from "#/components/shared/theme-provider";
import { getThemeServerFn } from "#/server/theme";
import appCss from "../styles.css?url";

interface MyRouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    head: () => ({
        links: [
            {
                href: appCss,
                rel: "stylesheet",
            },
        ],
        meta: [
            {
                charSet: "utf-8",
            },
            {
                content: "width=device-width, initial-scale=1",
                name: "viewport",
            },
            {
                description:
                    "One app to discover what to watch, keep a running log of what you've watched/want to watch, rate and review it, see what your friends think, and find out where to actually stream it.",
                title: "Reel",
            },
        ],
    }),
    loader: () => getThemeServerFn(),
    shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
    const theme = Route.useLoaderData();

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <HeadContent />
                {/* Blocking script: only matters when theme === 'system' (or cookie missing).
            Runs before first paint, so there is nothing to "flash" from. */}
                <script
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: Ignore
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{
              var t=${JSON.stringify(theme)};
              if(t==='system'||!t){
                var d=window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', d);
              }
            }catch(e){}})();`,
                    }}
                />
            </head>

            <body>
                <ThemeProvider initialTheme={theme}>
                    <Header />
                    {children}
                    <Toaster />
                </ThemeProvider>

                <TanStackDevtools
                    config={{
                        position: "bottom-right",
                    }}
                    plugins={[
                        {
                            name: "Tanstack Router",
                            render: <TanStackRouterDevtoolsPanel />,
                        },
                        {
                            name: "Tanstack Query",
                            render: <ReactQueryDevtoolsPanel />,
                        },
                    ]}
                />
                <Scripts />
            </body>
        </html>
    );
}
