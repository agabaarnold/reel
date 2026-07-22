import { IconStarFilled } from "@tabler/icons-react";
import PosterImage from "#/components/shared/poster-image";
import { releaseYear } from "#/lib/utils";
import type { MovieSummary } from "#/schema/movies";

interface MovieCardProps {
    movie: MovieSummary;
    width: string;
}

import { Link } from "`@tanstack/react-router`";

const MovieCard = ({ movie, width }: MovieCardProps) => (
    <Link className={width} params={{ movieId: movie.id }} to="/movie/$movieId">
        <PosterImage alt={movie.title} path={movie.poster_path} />

        <p className="mt-2 truncate font-medium text-sm">{movie.title}</p>

        <div className="flex items-center gap-1 text-muted-foreground text-xs">
            <IconStarFilled
                aria-hidden="true"
                className="size-3 text-amber-500"
            />

            <span>{movie.vote_average.toFixed(1)}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{releaseYear(movie.release_date)}</span>
        </div>
    </Link>
);

export default MovieCard;
