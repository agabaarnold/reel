import axios from "axios";
import { env } from "#/env/backend";

export class TmdbApiError extends Error {
    status: number | undefined;
    code: number | undefined;

    constructor(
        message: string,
        {
            status,
            code,
        }: { status: number | undefined; code: number | undefined }
    ) {
        super(message);
        this.name = "TmdbApiError";
        this.status = status;
        this.code = code;
    }
}

const tmdbClient = axios.create({
    baseURL: env.TMDB_BASE_URL,
    headers: { Accept: "application/json" },
    timeout: 10_000,
});

tmdbClient.interceptors.request.use((config) => {
    const token = env.TMDB_READ_ACCESS_TOKEN;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

tmdbClient.interceptors.response.use(
    (res) => res,
    (error: unknown) => {
        if (!axios.isAxiosError(error)) {
            return Promise.reject(error);
        }

        const data = error.response?.data as
            | { status_message?: string; status_code?: number }
            | undefined;

        const message =
            data?.status_message ??
            error.message ??
            "Something went wrong. Try again";

        return Promise.reject(
            new TmdbApiError(message, {
                code: data?.status_code,
                status: error.response?.status,
            })
        );
    }
);

export default tmdbClient;
