import { IconSearch } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import {
    type ChangeEvent,
    type FormEvent,
    type KeyboardEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { SearchMultiItem } from "#/schema/search";
import { useSearchSuggestions } from "#/server/queries";
import { Input } from "../ui/input";

function getSuggestionTitle(item: SearchMultiItem) {
    if (item.media_type === "movie") {
        return item.title;
    }
    return item.name;
}

function getSuggestionType(item: SearchMultiItem) {
    if (item.media_type === "movie") {
        return "Movie";
    }
    if (item.media_type === "tv") {
        return "TV show";
    }
    return "Person";
}

function SuggestionItem({
    highlighted,
    item,
    onSelect,
}: {
    highlighted: boolean;
    item: SearchMultiItem;
    onSelect: (item: SearchMultiItem) => Promise<void>;
}) {
    const handleClick = useCallback(() => onSelect(item), [item, onSelect]);

    return (
        <button
            aria-selected={highlighted}
            className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted aria-selected:bg-muted"
            onClick={handleClick}
            role="option"
            type="button"
        >
            <span className="truncate font-medium">
                {getSuggestionTitle(item)}
            </span>
            <span className="shrink-0 text-muted-foreground text-xs">
                {getSuggestionType(item)}
            </span>
        </button>
    );
}

const SearchBar = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [suggestionsOpen, setSuggestionsOpen] = useState(true);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedQuery(query.trim());
            setHighlightedIndex(-1);
        }, 250);

        return () => window.clearTimeout(timeout);
    }, [query]);

    const { data, isFetching } = useSearchSuggestions(
        debouncedQuery.length >= 2 ? debouncedQuery : ""
    );
    const suggestions = useMemo(
        () => data?.results.slice(0, 6) ?? [],
        [data?.results]
    );
    const showSuggestions = suggestionsOpen && query.trim().length >= 2;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedQuery = query.trim();
        await navigate({
            search: { q: trimmedQuery },
            to: "/search",
        });
    };

    const navigateToSuggestion = useCallback(
        async (item: SearchMultiItem) => {
            if (item.media_type === "movie") {
                await navigate({
                    params: { movieId: item.id },
                    to: "/movie/$movieId",
                });
                return;
            }
            if (item.media_type === "tv") {
                await navigate({
                    params: { seriesId: item.id },
                    to: "/tv/$seriesId",
                });
                return;
            }
            await navigate({
                params: { personId: item.id },
                to: "/person/$personId",
            });
        },
        [navigate]
    );

    let suggestionContent: ReactNode = null;
    if (isFetching) {
        suggestionContent = (
            <p className="px-3 py-2 text-muted-foreground text-sm">
                Searching...
            </p>
        );
    } else if (suggestions.length === 0) {
        suggestionContent = (
            <p className="px-3 py-2 text-muted-foreground text-sm">
                No suggestions found.
            </p>
        );
    } else {
        suggestionContent = suggestions.map((item, index) => (
            <SuggestionItem
                highlighted={index === highlightedIndex}
                item={item}
                key={`${item.media_type}-${item.id}`}
                onSelect={navigateToSuggestion}
            />
        ));
    }

    const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
        if (!(showSuggestions && suggestions.length)) {
            return;
        }
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlightedIndex((index) => (index + 1) % suggestions.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlightedIndex((index) =>
                index <= 0 ? suggestions.length - 1 : index - 1
            );
        } else if (event.key === "Enter" && highlightedIndex >= 0) {
            event.preventDefault();
            await navigateToSuggestion(suggestions[highlightedIndex]);
        } else if (event.key === "Escape") {
            setSuggestionsOpen(false);
            setHighlightedIndex(-1);
        }
    };
    const handleQueryChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
            setSuggestionsOpen(true);
        },
        []
    );

    return (
        <form
            aria-label="Search"
            className="min-w-0 flex-1"
            onSubmit={handleSubmit}
        >
            <div className="relative w-full max-w-sm">
                <IconSearch
                    aria-hidden="true"
                    className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                    aria-label="Search movies, shows, and people"
                    className="pl-8"
                    onChange={handleQueryChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Search movies, shows, people"
                    type="search"
                    value={query}
                />
                {showSuggestions ? (
                    <div
                        aria-label="Search suggestions"
                        className="absolute top-full right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-lg"
                        role="listbox"
                    >
                        {suggestionContent}
                    </div>
                ) : null}
            </div>
        </form>
    );
};

export default SearchBar;
