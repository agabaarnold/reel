import axios from "axios";
import { env } from "#/env/backend";

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
    (error) => {
        const message =
            error.response?.data?.message ?? "Something went wrong. Try again";
        return Promise.reject(new Error(message));
    }
);

export default tmdbClient;
