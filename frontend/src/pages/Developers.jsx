import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Users,
    Building2,
    MapPin,
    Sparkles,
    RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

import { getDevelopers } from "../api/developerApi";
import DeveloperCard from "../components/DeveloperCard";

export default function Developers() {

    const [developers, setDevelopers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDevelopers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getDevelopers();

            console.log("Developers API response:", response);

            /*
             * Support both:
             *
             * {
             *   developers: [...]
             * }
             *
             * and:
             *
             * [...]
             */
            let developerList = [];

            if (Array.isArray(response)) {
                developerList = response;
            } else if (Array.isArray(response?.developers)) {
                developerList = response.developers;
            } else if (Array.isArray(response?.data)) {
                developerList = response.data;
            }

            setDevelopers(developerList);

        } catch (err) {
            console.error(
                "Failed to load developers:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load developers."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDevelopers();
    }, []);

    const filteredDevelopers = useMemo(() => {

        const query = search
            .trim()
            .toLowerCase();

        if (!query) {
            return developers;
        }

        return developers.filter((developer) => {

            const values = [
                developer?.name,
                developer?.role,
                developer?.company,
                developer?.location,
                developer?.id,
            ];

            return values
                .filter(Boolean)
                .some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(query)
                );
        });

    }, [developers, search]);

    const companies = useMemo(() => {

        return new Set(
            developers
                .map((developer) => developer?.company)
                .filter(Boolean)
        );

    }, [developers]);

    const locations = useMemo(() => {

        return new Set(
            developers
                .map((developer) => developer?.location)
                .filter(Boolean)
        );

    }, [developers]);

    return (
        <div className="min-h-[calc(100vh-5rem)] space-y-8">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <motion.section
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.4,
                }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/10 via-transparent to-indigo-600/10 p-8"
            >

                <div className="relative z-10">

                    <div className="mb-4 flex items-center gap-2 text-sm text-violet-400">

                        <Sparkles size={16} />

                        Developer Intelligence

                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Developers
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                        Explore developers, their skills,
                        experience, companies and professional
                        relationships across the graph.
                    </p>

                </div>

                {/* Decorative glow */}

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

                <div className="absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-indigo-600/10 blur-3xl" />

            </motion.section>


            {/* =====================================================
                STATS
            ===================================================== */}

            <section className="grid gap-4 sm:grid-cols-3">

                {/* Developers */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.05,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
                >

                    <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                            <Users size={20} />
                        </div>

                        <div>

                            <p className="text-xs text-slate-500">
                                Developers
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-white">
                                {developers.length}
                            </p>

                        </div>

                    </div>

                </motion.div>


                {/* Companies */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.1,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-500/30 hover:bg-white/[0.05]"
                >

                    <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                            <Building2 size={20} />
                        </div>

                        <div>

                            <p className="text-xs text-slate-500">
                                Companies
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-white">
                                {companies.size}
                            </p>

                        </div>

                    </div>

                </motion.div>


                {/* Locations */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.15,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-indigo-500/30 hover:bg-white/[0.05]"
                >

                    <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                            <MapPin size={20} />
                        </div>

                        <div>

                            <p className="text-xs text-slate-500">
                                Locations
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-white">
                                {locations.size}
                            </p>

                        </div>

                    </div>

                </motion.div>

            </section>


            {/* =====================================================
                SEARCH + CONTENT
            ===================================================== */}

            <section>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Developer Directory
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            {loading
                                ? "Loading developers..."
                                : `${filteredDevelopers.length} developers found`
                            }
                        </p>

                    </div>


                    <div className="flex w-full gap-2 sm:w-auto">

                        {/* Search */}

                        <div className="relative w-full sm:w-80">

                            <Search
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search developers..."
                                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-500/50 focus:bg-white/[0.05]"
                            />

                        </div>


                        {/* Refresh */}

                        <button
                            type="button"
                            onClick={loadDevelopers}
                            disabled={loading}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            <RefreshCw
                                size={17}
                                className={
                                    loading
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                        </button>

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (

                                <div
                                    key={item}
                                    className="h-52 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
                                />

                            )
                        )}

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {!loading && error && (

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center"
                    >

                        <p className="text-sm font-medium text-red-400">
                            Failed to load developers
                        </p>

                        <p className="mt-2 text-xs text-red-400/70">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadDevelopers}
                            className="mt-5 rounded-xl bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
                        >
                            Try again
                        </button>

                    </motion.div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredDevelopers.length === 0 && (

                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            className="rounded-2xl border border-white/10 bg-white/[0.03] p-16 text-center"
                        >

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">

                                <Users size={24} />

                            </div>

                            <h3 className="mt-5 text-lg font-medium text-white">
                                No developers found
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                {search
                                    ? "Try a different search term."
                                    : "There are no developers available in the graph."
                                }
                            </p>

                        </motion.div>

                    )}


                {/* =================================================
                    DEVELOPER CARDS
                ================================================= */}

                {!loading &&
                    !error &&
                    filteredDevelopers.length > 0 && (

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                            {filteredDevelopers.map(
                                (developer, index) => (

                                    <DeveloperCard
                                        key={
                                            developer?.id ??
                                            `${developer?.name}-${index}`
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