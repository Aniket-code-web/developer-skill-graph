import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

export const getDevelopers = async () => {
    const response = await api.get("/developers");

    return response.data;
};

export const getDeveloper = async (developerId) => {
    const response = await api.get(
        `/developers/${developerId}`
    );

    return response.data;
};

export const getDeveloperSkills = async (developerId) => {
    const response = await api.get(
        `/developers/${developerId}/skills`
    );

    return response.data;
};

export const getSimilarDevelopers = async (developerId) => {
    const response = await api.get(
        `/developers/${developerId}/similar`
    );

    return response.data;
};

export const getDeveloperConnections = async (developerId) => {
    const response = await api.get(
        `/developers/${developerId}/connections`
    );

    return response.data;
};

export const getGraph = async () => {
    const response = await api.get("/graph");

    return response.data;
};

/**
 * Global search
 *
 * Searches:
 * - Developers
 * - Skills / Technologies
 * - Companies
 */
export const searchGlobal = async (query) => {
    const response = await api.get("/search", {
        params: {
            q: query,
        },
    });

    return response.data;
};