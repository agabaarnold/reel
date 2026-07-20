import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import { env } from "#/env/backend";

export type Theme = "light" | "dark" | "system";

const THEME_COOKIE = "theme";

export const getThemeServerFn = createServerFn({ method: "GET" }).handler(
    async () => (getCookie(THEME_COOKIE) as Theme) ?? "system"
);

const themeSchema = z.enum(["light", "dark", "system"]);

export const setThemeServerFn = createServerFn({ method: "POST" })
    .validator((theme: unknown) => themeSchema.parse(theme))
    .handler(async ({ data }) =>
        setCookie(THEME_COOKIE, data, {
            maxAge: 60 * 60 * 24 * 365,
            path: "/",
            sameSite: "lax",
            secure: env.NODE_ENV === "production",
        })
    );
