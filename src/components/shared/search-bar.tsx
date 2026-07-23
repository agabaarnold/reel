import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { type ChangeEvent, type FormEvent, useCallback, useState } from "react";
import { Input } from "../ui/input";

const SearchBar = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedQuery = query.trim();
        await navigate({
            search: { q: trimmedQuery },
            to: "/search",
        });
    };
    const handleQueryChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
        },
        []
    );

    return (
        <form aria-label="Search" onSubmit={handleSubmit}>
            <div className="relative max-w-sm">
                <IconSearch
                    aria-hidden="true"
                    className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                    aria-label="Search movies, shows, and people"
                    className="pl-8"
                    onChange={handleQueryChange}
                    placeholder="Search movies, shows, people"
                    type="search"
                    value={query}
                />
            </div>
        </form>
    );
};

export default SearchBar;
