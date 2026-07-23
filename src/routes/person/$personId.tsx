import { IconArrowLeft, IconExternalLink } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import PosterImage from "#/components/shared/poster-image";
import { Badge } from "#/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";
import { releaseYear } from "#/lib/utils";
import type { CreditWithMediaType } from "#/schema/person";
import {
    configurationOptions,
    personCreditsOptions,
    personDetailsOptions,
    usePersonCredits,
    usePersonDetails,
} from "#/server/queries";

const personParamsSchema = z.object({
    personId: z.coerce.number().int().positive(),
});

export const Route = createFileRoute("/person/$personId")({
    component: PersonDetailsPage,
    loader: async ({ context, params }) => {
        await Promise.all([
            context.queryClient.ensureQueryData(configurationOptions()),
            context.queryClient.ensureQueryData(
                personDetailsOptions(params.personId)
            ),
            context.queryClient.ensureQueryData(
                personCreditsOptions(params.personId)
            ),
        ]);
    },
    params: personParamsSchema,
});

function PersonCreditCard({ credit }: { credit: CreditWithMediaType }) {
    const title = credit.title ?? credit.name;

    if (!title) {
        return null;
    }

    const year = releaseYear(
        credit.release_date ?? credit.first_air_date ?? ""
    );
    const role = credit.character ?? credit.job ?? year;

    if (credit.media_type === "movie") {
        return (
            <Link
                className="group block"
                params={{ movieId: credit.id }}
                to="/movie/$movieId"
            >
                <PosterImage
                    alt={`Poster for ${title}`}
                    className="transition-transform group-hover:scale-[1.02]"
                    path={credit.poster_path}
                />
                <p className="mt-2 truncate font-medium text-sm group-hover:text-primary">
                    {title}
                </p>
                <p className="truncate text-muted-foreground text-xs">{role}</p>
            </Link>
        );
    }

    return (
        <Link
            className="group block"
            params={{ seriesId: credit.id }}
            to="/tv/$seriesId"
        >
            <PosterImage
                alt={`Poster for ${title}`}
                className="transition-transform group-hover:scale-[1.02]"
                path={credit.poster_path}
            />
            <p className="mt-2 truncate font-medium text-sm group-hover:text-primary">
                {title}
            </p>
            <p className="truncate text-muted-foreground text-xs">{role}</p>
        </Link>
    );
}

function CreditsSection({
    credits,
    title,
}: {
    credits: CreditWithMediaType[];
    title: string;
}) {
    if (!credits.length) {
        return null;
    }

    const headingId = `${title.toLowerCase().replaceAll(" ", "-")}-heading`;

    return (
        <section aria-labelledby={headingId} className="mt-12">
            <h2
                className="mb-4 font-heading font-semibold text-2xl"
                id={headingId}
            >
                {title}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {credits.slice(0, 12).map((credit) => (
                    <PersonCreditCard
                        credit={credit}
                        key={`${credit.media_type}-${credit.id}-${credit.character ?? credit.job ?? "credit"}`}
                    />
                ))}
            </div>
        </section>
    );
}

function PersonDetailsPage() {
    const { personId } = Route.useParams();
    const { data: person } = usePersonDetails(personId);
    const { data: credits } = usePersonCredits(personId);
    const movieCredits = credits.cast.filter(
        (credit) => credit.media_type === "movie"
    );
    const tvCredits = credits.cast.filter(
        (credit) => credit.media_type === "tv"
    );

    return (
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
                className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
                to="/"
            >
                <IconArrowLeft aria-hidden="true" className="size-4" />
                Back to home
            </Link>

            <Card className="mt-6 md:flex-row">
                <div className="shrink-0 p-6 md:w-72">
                    <PosterImage
                        alt={`Profile of ${person.name}`}
                        className="rounded-full"
                        path={person.profile_path}
                        variant="profile"
                    />
                </div>
                <div className="flex flex-1 flex-col">
                    <CardHeader>
                        <Badge variant="secondary">
                            {person.known_for_department}
                        </Badge>
                        <CardTitle className="text-3xl">
                            {person.name}
                        </CardTitle>
                        {person.place_of_birth ? (
                            <CardDescription>
                                {person.place_of_birth}
                            </CardDescription>
                        ) : null}
                    </CardHeader>
                    <CardContent>
                        <p className="leading-7">
                            {person.biography ||
                                "No biography is available for this person."}
                        </p>
                        {person.homepage ? (
                            <a
                                className="mt-4 inline-flex items-center gap-2 text-primary text-sm hover:underline"
                                href={person.homepage}
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                Official website
                                <IconExternalLink
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </a>
                        ) : null}
                    </CardContent>
                </div>
            </Card>

            <CreditsSection credits={movieCredits} title="Movie credits" />
            <CreditsSection credits={tvCredits} title="TV credits" />
            <CreditsSection credits={credits.crew} title="Crew credits" />
        </main>
    );
}
