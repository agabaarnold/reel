import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { setThemeServerFn, type Theme } from "#/server/theme";

interface ThemeContextValue {
    setTheme: (theme: Theme) => void;
    theme: Theme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveSystem() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function ThemeProvider({
    children,
    initialTheme,
}: {
    children: React.ReactNode;
    initialTheme: Theme;
}) {
    const [theme, setThemeState] = useState<Theme>(initialTheme);

    const setTheme = useCallback((next: Theme) => {
        setThemeState(next);

        const resolved = next === "system" ? resolveSystem() : next;
        document.documentElement.classList.toggle("dark", resolved === "dark");

        cookieStore
            .set({
                expires: Date.now() + 60 * 60 * 24 * 365 * 1000,
                name: "theme",
                path: "/",
                sameSite: "lax",
                value: next,
            })
            .catch(() => undefined);
        setThemeServerFn({ data: next }).catch(() => {});
    }, []);

    // If user picked "system", keep listening for OS-level changes.
    useEffect(() => {
        if (theme !== "system") {
            return;
        }

        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () =>
            document.documentElement.classList.toggle("dark", mq.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ setTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used inside <ThemeProvider>");
    }

    return ctx;
}
