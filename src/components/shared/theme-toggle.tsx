import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import { useCallback } from "react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
    const { setTheme } = useTheme();

    const setLight = useCallback(() => setTheme("light"), [setTheme]);
    const setDark = useCallback(() => setTheme("dark"), [setTheme]);
    const setSystem = useCallback(() => setTheme("system"), [setTheme]);

    return (
        <DropdownMenuTrigger>
            <Button size="icon" variant="outline">
                <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>

            <DropdownMenu>
                <DropdownMenuItem onClick={setLight}>
                    <IconSun className="mr-2 h-4 w-4" /> Light
                </DropdownMenuItem>

                <DropdownMenuItem onClick={setDark}>
                    <IconMoon className="mr-2 h-4 w-4" /> Dark
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={setSystem}>
                    <IconDeviceDesktop className="mr-2 h-4 w-4" /> System
                </DropdownMenuItem>
            </DropdownMenu>
        </DropdownMenuTrigger>
    );
}
