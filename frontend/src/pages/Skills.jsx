import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Code2,
    Users,
    Layers3,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

import {
    getDevelopers,
    getDeveloperSkills,
} from "../api/developerApi";

import { useNavigate } from "react-router-dom";


function extractSkills(response) {
    if (!response) {
        return [];
    }

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response.skills)) {
        return response.skills;
    }

    if (Array.isArray(response.data)) {
        return response.data;
    }

    return [];
}


function normalizeSkill(skill) {
    if (typeof skill === "string") {
        return {
            name: skill,
            category: "Technology",
        };
    }

    if (!skill || typeof skill !== "object") {
        return null;
    }

    return {
        name:
            skill.name ||
            skill.skill ||
            skill.technology ||
            skill.title ||
            "Unknown Skill",

        category:
            skill.category ||
            skill.type ||
            skill.domain ||
            "Technology",

        level:
            skill.level ||
            skill.proficiency ||
            null,
    };
}


function getInitials(name) {
    return name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}


export default function Skills() {

    const [developers, setDevelopers] = useState([]);
    const [skills, setSkills] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const loadSkills = async () => {

            try {

                setLoading(true);
                setError("");

                const developerResponse =
                    await getDevelopers();

                const developerList =
                    developerResponse?.developers || [];

                setDevelopers(developerList);

                const skillResponses =
                    await Promise.all(
                        developerList.map(
                            async (developer) => {

                                try {

                                    const response =
                                        await getDeveloperSkills(
                                            developer.id
                                        );

                                    return {
                                        developer,
                                        skills:
                                            extractSkills(
                                                response
                                            ),
                                    };

                                } catch (err) {

                                    console.error(
                                        `Failed to load skills for ${developer.id}`,
                                        err
                                    );

                                    return {
                                        developer,
                                        skills: [],
                                    };
                                }
                            }
                        )
                    );

                const skillMap = new Map();

                skillResponses.forEach(
                    ({
                        developer,
                        skills: developerSkills,
                    }) => {

                        developerSkills.forEach(
                            (rawSkill) => {

                                const skill =
                                    normalizeSkill(
                                        rawSkill
                                    );

                                if (!skill) {
                                    return;
                                }

                                const key =
                                    skill.name
                                        .trim()
                                        .toLowerCase();

                                if (!key) {
                                    return;
                                }

                                if (
                                    !skillMap.has(
                                        key
                                    )
                                ) {

                                    skillMap.set(
                                        key,
                                        {
                                            name:
                                                skill.name,
                                            category:
                                                skill.category,
                                            developers:
                                                [],
                                        }
                                    );
                                }

                                const existing =
                                    skillMap.get(
                                        key
                                    );

                                const alreadyExists =
                                    existing.developers.some(
                                        (item) =>
                                            item.id ===
                                            developer.id
                                    );

                                if (
                                    !alreadyExists
                                ) {

                                    existing.developers.push(
                                        developer
                                    );
                                }
                            }
                        );
                    }
                );

                const aggregatedSkills =
                    Array.from(
                        skillMap.values()
                    )
                        .map((skill) => ({
                            ...skill,
                            developerCount:
                                skill.developers.length,
                        }))
                        .sort(
                            (a, b) =>
                                b.developerCount -
                                a.developerCount
                        );

                setSkills(
                    aggregatedSkills
                );

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to load skills."
                );

            } finally {

                setLoading(false);

            }
        };

        loadSkills();

    }, []);


    const categories = useMemo(() => {

        const values = new Set(
            skills.map(
                (skill) => skill.category
            )
        );

        return [
            "All",
            ...Array.from(values).sort(),
        ];

    }, [skills]);


    const filteredSkills = useMemo(() => {

        const query =
            search
                .toLowerCase()
                .trim();

        return skills.filter(
            (skill) => {

                const matchesSearch =
                    !query ||
                    skill.name
                        .toLowerCase()
                        .includes(query) ||
                    skill.category
                        .toLowerCase()
                        .includes(query);

                const matchesCategory =
                    category === "All" ||
                    skill.category ===
                    category;

                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );

    }, [
        skills,
        search,
        category,
    ]);


    return (
        <div className="space-y-8">

            {/* Header */}

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

                        Technology Intelligence

                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">

                        Explore developer skills.

                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">

                        Discover the technologies used
                        across your developer ecosystem
                        and understand where expertise
                        exists.

                    </p>

                </div>

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

                <div className="absolute -bottom-24 right-20 h-52 w-52 rounded-full bg-indigo-600/10 blur-3xl" />

            </motion.section>


            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-3">

                <Stat
                    icon={Code2}
                    title="Technologies"
                    value={skills.length}
                    description="Skills in the graph"
                />

                <Stat
                    icon={Users}
                    title="Developers"
                    value={developers.length}
                    description="Engineers analyzed"
                />

                <Stat
                    icon={Layers3}
                    title="Categories"
                    value={
                        Math.max(
                            categories.length - 1,
                            0
                        )
                    }
                    description="Technology categories"
                />

            </section>


            {/* Controls */}

            <section>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <h2 className="text-xl font-semibold text-white">

                            Skills

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                            Browse technologies across
                            your developer graph.

                        </p>

                    </div>


                    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                        {/* Search */}

                        <div className="relative w-full sm:w-72">

                            <Search
                                size={17}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search skills..."
                                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-500/50"
                            />

                        </div>


                        {/* Category */}

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                            className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-violet-500/50"
                        >

                            {categories.map(
                                (item) => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item}
                                    </option>
                                )
                            )}

                        </select>

                    </div>

                </div>

            </section>


            {/* Loading */}

            {loading && (

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />

                    <p className="text-sm text-slate-500">

                        Loading skills...

                    </p>

                </div>

            )}


            {/* Error */}

            {!loading && error && (

                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-12 text-center">

                    <p className="text-sm text-red-400">

                        {error}

                    </p>

                </div>

            )}


            {/* Empty */}

            {!loading &&
                !error &&
                filteredSkills.length === 0 && (

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

                        <Code2
                            size={32}
                            className="mx-auto mb-4 text-slate-600"
                        />

                        <p className="text-sm text-slate-500">

                            No skills found.

                        </p>

                        {(search ||
                            category !== "All") && (

                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setCategory(
                                            "All"
                                        );
                                    }}
                                    className="mt-4 text-sm font-medium text-violet-400 hover:text-violet-300"
                                >
                                    Clear filters
                                </button>

                            )}

                    </div>

                )}


            {/* Skill Cards */}

            {!loading &&
                !error &&
                filteredSkills.length > 0 && (

                    <motion.section
                        layout
                        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                    >

                        {filteredSkills.map(
                            (skill, index) => (

                                <SkillCard
                                    key={
                                        skill.name
                                    }
                                    skill={
                                        skill
                                    }
                                    index={
                                        index
                                    }
                                />

                            )
                        )}

                    </motion.section>

                )}

        </div>
    );
}


/* ----------------------------- */
/* Stat                          */
/* ----------------------------- */

function Stat({
    icon: Icon,
    title,
    value,
    description,
}) {

    return (

        <motion.div
            initial={{
                opacity: 0,
                y: 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            whileHover={{
                y: -4,
            }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
        >

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm text-slate-500">

                        {title}

                    </p>

                    <p className="mt-2 text-3xl font-semibold text-white">

                        {value}

                    </p>

                    <p className="mt-1 text-xs text-slate-500">

                        {description}

                    </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">

                    <Icon size={20} />

                </div>

            </div>

        </motion.div>
    );
}


/* ----------------------------- */
/* Skill Card                    */
/* ----------------------------- */

function SkillCard({
    skill,
    index,
}) {

    const navigate = useNavigate();

    const maxDevelopers = Math.max(
        skill.developerCount,
        1
    );

    return (
        <motion.button
            layout
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                delay: Math.min(index * 0.04, 0.4),
            }}
            whileHover={{
                y: -5,
            }}
            onClick={() =>
                navigate(
                    `/skills/${encodeURIComponent(skill.name)}`
                )
            }
            className="group w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-violet-500/30 hover:bg-white/[0.05]"
        >

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-300">
                        <Code2 size={20} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-white">
                            {skill.name}
                        </h3>

                        <p className="text-xs text-slate-500">
                            {skill.category}
                        </p>
                    </div>

                </div>

                <ArrowUpRight
                    size={18}
                    className="text-slate-600 transition group-hover:text-violet-400"
                />

            </div>

            <div className="mt-6">

                <div className="flex items-center justify-between">

                    <span className="text-xs text-slate-500">
                        Developer adoption
                    </span>

                    <span className="text-xs font-medium text-violet-400">
                        {skill.developerCount}{" "}
                        {skill.developerCount === 1
                            ? "developer"
                            : "developers"}
                    </span>

                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">

                    <motion.div
                        initial={{
                            width: 0,
                        }}
                        animate={{
                            width: `${Math.min(
                                (skill.developerCount /
                                    maxDevelopers) *
                                100,
                                100
                            )}%`,
                        }}
                        transition={{
                            duration: 0.6,
                            delay: index * 0.04,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                    />

                </div>

            </div>

            <div className="mt-5 border-t border-white/5 pt-4">

                <div className="flex -space-x-2">

                    {skill.developers
                        .slice(0, 5)
                        .map((developer) => (
                            <div
                                key={developer.id}
                                title={developer.name}
                                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-950 bg-gradient-to-br from-violet-500 to-indigo-500 text-[10px] font-semibold text-white"
                            >
                                {getInitials(
                                    developer.name
                                )}
                            </div>
                        ))}

                </div>

                {skill.developerCount > 5 && (
                    <p className="mt-2 text-xs text-slate-500">
                        +
                        {skill.developerCount - 5}{" "}
                        more developers
                    </p>
                )}

            </div>

        </motion.button>
    );
}