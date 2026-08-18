import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Users,
    Brain,
    Building2,
    Layers3,
    Sparkles,
} from "lucide-react";

import { motion } from "framer-motion";

import { getDevelopers } from "../api/developerApi";

import StatCard from "../components/StatCard";
import DeveloperCard from "../components/DeveloperCard";


export default function Dashboard() {

    const [developers, setDevelopers] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadDevelopers = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getDevelopers();

                setDevelopers(
                    Array.isArray(data?.developers)
                        ? data.developers
                        : []
                );

            } catch (err) {

                console.error(
                    "Failed to load developers:",
                    err
                );

                setError(
                    "Unable to load developers."
                );

            } finally {

                setLoading(false);

            }

        };

        loadDevelopers();

    }, []);


    const filteredDevelopers =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return developers;
            }

            return developers.filter(
                (developer) =>
                    [
                        developer.name,
                        developer.role,
                        developer.company,
                        developer.location,
                    ]
                        .filter(Boolean)
                        .some((value) =>
                            String(value)
                                .toLowerCase()
                                .includes(query)
                        )
            );

        }, [developers, search]);


    const companies =
        useMemo(
            () =>
                new Set(
                    developers
                        .map(
                            (developer) =>
                                developer.company
                        )
                        .filter(Boolean)
                ),
            [developers]
        );


    const locations =
        useMemo(
            () =>
                new Set(
                    developers
                        .map(
                            (developer) =>
                                developer.location
                        )
                        .filter(Boolean)
                ),
            [developers]
        );


    const averageExperience =
        useMemo(() => {

            if (!developers.length) {
                return 0;
            }

            const total =
                developers.reduce(
                    (sum, developer) =>
                        sum +
                        Number(
                            developer.experience || 0
                        ),
                    0
                );

            return Math.round(
                total / developers.length
            );

        }, [developers]);


    return (
        <div className="space-y-8">

            {/* Hero */}
            <motion.section
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10 p-8"
            >

                <div className="relative z-10">

                    <div className="mb-4 flex items-center gap-2 text-sm text-violet-400">

                        <Sparkles size={16} />

                        Developer Intelligence Platform

                    </div>

                    <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Understand the developer ecosystem.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                        Explore developers, skills,
                        relationships, and connections
                        across your engineering ecosystem.
                    </p>

                </div>

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

                <div className="absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-indigo-600/10 blur-3xl" />

            </motion.section>


            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Developers"
                    value={developers.length}
                    description="Engineers in the graph"
                    icon={Users}
                />

                <StatCard
                    title="Companies"
                    value={companies.size}
                    description="Organizations represented"
                    icon={Building2}
                />

                <StatCard
                    title="Locations"
                    value={locations.size}
                    description="Developer locations"
                    icon={Layers3}
                />

                <StatCard
                    title="Experience"
                    value={averageExperience}
                    description="Average years"
                    icon={Brain}
                />

            </section>


            {/* Developers */}
            <section>

                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Developers
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Explore people in your developer graph.
                        </p>

                    </div>


                    <div className="w-full sm:w-72">

                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search developers..."
                            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500/50"
                        />

                    </div>

                </div>


                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">

                        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading developers...
                        </p>

                    </div>
                )}


                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center text-sm text-red-400">
                        {error}
                    </div>
                )}


                {/* Empty */}
                {!loading &&
                    !error &&
                    filteredDevelopers.length === 0 && (

                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-slate-500">
                            No developers found.
                        </div>

                    )}


                {/* Cards */}
                {!loading &&
                    !error &&
                    filteredDevelopers.length > 0 && (

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                            {filteredDevelopers.map(
                                (developer, index) => (

                                    <DeveloperCard
                                        key={
                                            developer.id ??
                                            `${developer.name}-${index}`
                                        }
                                        developer={developer}
                                        index={index}
                                    />

                                )
                            )}

                        </div>

                    )}

            </section>

        </div>
    );
}