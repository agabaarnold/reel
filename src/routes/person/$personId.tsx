import { IconArrowLeft } from "@tabler/icons-react";
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
import {
    configurationOptions,
    personDetailsOptions,
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
        ]);
    },
    params: personParamsSchema,
});

function PersonDetailsPage() {
    const { personId } = Route.useParams();
    const { data: person } = usePersonDetails(personId);

    return (
        <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
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
                    </CardContent>
                </div>
            </Card>
        </main>
    );
}
