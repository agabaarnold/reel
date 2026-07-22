import { IconStarFilled, IconUser } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import PosterImage from "#/components/shared/poster-image";
import { cn, releaseYear } from "#/lib/utils";
import type { MovieSummary } from "#/schema/movies";
import type { PersonSummary } from "#/schema/person";
import type { TvSummary } from "#/schema/tv";

interface MovieCardProps {
    movie: MovieSummary;
    width?: string;
}

interface TvCardProps {
    series: TvSummary;
}

interface PersonCardProps {
    person: PersonSummary;
}

function RatingAndYear({ rating, year }: { rating: number; year: string }) {
    return (
        <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <IconStarFilled
                aria-hidden="true"
                className="size-3 text-amber-500"
            />

            <span>{rating.toFixed(1)}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{year}</span>
        </div>
    );
}

export function MovieCard({ movie, width = "w-36 sm:w-40" }: MovieCardProps) {
    return (
        <Link
            className={cn(
                "group shrink-0 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4",
                width
            )}
            params={{ movieId: movie.id }}
            to="/movie/$movieId"
        >
            <PosterImage
                alt={`Poster for ${movie.title}`}
                className="transition-transform duration-200 group-hover:scale-[1.02]"
                path={movie.poster_path}
            />

            <p className="mt-2 truncate font-medium text-sm group-hover:text-primary">
                {movie.title}
            </p>

            <RatingAndYear
                rating={movie.vote_average}
                year={releaseYear(movie.release_date)}
            />
        </Link>
    );
}

export function TvCard({ series }: TvCardProps) {
    return (
        <Link
            className="group w-36 shrink-0 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4 sm:w-40"
            params={{ seriesId: series.id }}
            to="/tv/$seriesId"
        >
            <PosterImage
                alt={`Poster for ${series.name}`}
                className="transition-transform duration-200 group-hover:scale-[1.02]"
                path={series.poster_path}
            />

            <p className="mt-2 truncate font-medium text-sm group-hover:text-primary">
                {series.name}
            </p>

            <RatingAndYear
                rating={series.vote_average}
                year={releaseYear(series.first_air_date)}
            />
        </Link>
    );
}

export function PersonCard({ person }: PersonCardProps) {
    return (
        <Link
            className="group w-28 shrink-0 text-center focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4 sm:w-32"
            params={{ personId: person.id }}
            to="/person/$personId"
        >
            <PosterImage
                alt={`Profile of ${person.name}`}
                className="rounded-full transition-transform duration-200 group-hover:scale-[1.02]"
                path={person.profile_path}
                variant="profile"
            />

            <p className="mt-2 truncate font-medium text-sm group-hover:text-primary">
                {person.name}
            </p>

            <p className="flex items-center justify-center gap-1 truncate text-muted-foreground text-xs">
                <IconUser aria-hidden="true" className="size-3" />
                {person.known_for_department}
            </p>
        </Link>
    );
}
