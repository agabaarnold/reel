import { IconMovie } from "@tabler/icons-react";
import { Link, type LinkOptions } from "@tanstack/react-router";
import { ThemeToggle } from "./theme-toggle";

interface Nav {
    label: string;
    to: LinkOptions["to"];
}

const NAV_PAGES: Nav[] = [
    { label: "Home", to: "/" },
    { label: "Movies", to: "/movie" },
    { label: "TV-Shows", to: "/tv" },
];

const Header = () => (
    <header className="sticky top-0 z-30 mx-auto w-full border-b bg-secondary/10 px-8 py-4 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-10">
                <Link
                    className="flex gap-2 font-extrabold font-heading uppercase"
                    to="/"
                >
                    <IconMovie /> Reel
                </Link>

                <div className="flex items-center gap-6">
                    {NAV_PAGES.map((page) => (
                        <Link
                            activeProps={{
                                className: "font-bold text-primary ",
                            }}
                            inactiveProps={{
                                className: "underline-offset-2 hover:underline",
                            }}
                            key={page.to}
                            to={page.to}
                        >
                            {page.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="">
                <ThemeToggle />
            </div>
        </div>
    </header>
);

export default Header;
