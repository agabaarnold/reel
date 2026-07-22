import { IconSearch } from "@tabler/icons-react";
import { Input } from "../ui/input";

const SearchBar = () => {
    return (
        <div className="">
            {/* Decorative for now — wire this up to the /search route once it exists */}
            <div className="relative max-w-sm">
                <IconSearch
                    aria-hidden="true"
                    className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                    aria-label="Search movies, shows, and people"
                    className="pl-8"
                    placeholder="Search movies, shows, people"
                    type="search"
                />
            </div>
        </div>
    );
};

export default SearchBar;
