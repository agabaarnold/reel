import { IconMenu2, IconMovie } from "@tabler/icons-react";
import { Link, type LinkOptions } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Button } from "#/components/ui/button";
import {
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "#/components/ui/sheet";
import SearchBar from "./search-bar";
import { ThemeToggle } from "./theme-toggle";

interface Nav {
    label: string;
    to: LinkOptions["to"];
}

const NAV_PAGES: Nav[] = [
    { label: "Home", to: "/" },
    { label: "Movies", to: "/movie" },
    { label: "TV-Shows", to: "/tv" },
    { label: "Discover", to: "/discover" },
    { label: "Genres", to: "/genres" },
    { label: "People", to: "/people" },
];

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleMobileNavigation = useCallback(() => {
        setMobileOpen(false);
    }, []);

    return (
        <header className="sticky top-0 z-30 mx-auto w-full border-b bg-secondary/10 px-4 py-3 shadow-sm backdrop-blur-sm sm:px-6 md:px-8">
            <div className="flex items-center gap-3">
                <Link
                    className="flex shrink-0 gap-2 font-extrabold font-heading uppercase"
                    to="/"
                >
                    <IconMovie /> Reel
                </Link>

                <nav aria-label="Main navigation" className="hidden md:block">
                    <div className="flex items-center gap-5">
                        {NAV_PAGES.map((page) => (
                            <Link
                                activeProps={{
                                    className: "font-bold text-primary",
                                }}
                                inactiveProps={{
                                    className:
                                        "underline-offset-2 hover:underline",
                                }}
                                key={page.to}
                                to={page.to}
                            >
                                {page.label}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="ml-auto flex min-w-0 items-center gap-2">
                    <SearchBar />
                    <ThemeToggle />
                    <div className="md:hidden">
                        <SheetTrigger
                            isOpen={mobileOpen}
                            onOpenChange={setMobileOpen}
                        >
                            <Button
                                aria-label="Open navigation menu"
                                size="icon"
                                variant="outline"
                            >
                                <IconMenu2 aria-hidden="true" />
                            </Button>
                            <SheetContent aria-label="Navigation menu">
                                <SheetHeader>
                                    <SheetTitle>Reel navigation</SheetTitle>
                                </SheetHeader>
                                <nav
                                    aria-label="Mobile navigation"
                                    className="flex flex-col gap-1 px-4"
                                >
                                    {NAV_PAGES.map((page) => (
                                        <Link
                                            className="rounded-lg px-2.5 py-2 text-sm hover:bg-muted"
                                            key={page.to}
                                            onClick={handleMobileNavigation}
                                            to={page.to}
                                        >
                                            {page.label}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </SheetTrigger>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
