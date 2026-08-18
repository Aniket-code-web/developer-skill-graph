import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    ArrowUpRight,
    Code2,
    Users,
    Layers3,
    MapPin,
    BriefcaseBusiness,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import {
    getDevelopers,
    getDeveloperSkills,
} from "../api/developerApi";


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
    };
}


function getInitials(name) {
    return (
        name
            ?.split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "?"
    );
}


export default function SkillDetails() {

    const { skillName } = useParams();
    const navigate = useNavigate();

    const decodedSkillName =
        decodeURIComponent(skillName || "");


    const [developers, setDevelopers] = useState([]);
    const [allSkills, setAllSkills] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadSkillDetails = async () => {

            try {

                setLoading(true);
                setError("");

                const developerResponse =
                    await getDevelopers();

                const developerList =
                    developerResponse?.developers || [];

                const results =
                    await Promise.all(
                        developerList.map(
                            async (developer) => {

                                try {

                                    const response =
                                        await getDeveloperSkills(
                                            developer.id
                                        );

                                    const rawSkills =
                                        extractSkills(
                                            response
                                        );

                                    const normalized =
                                        rawSkills
                                            .map(
                                                normalizeSkill
                                            )
                                            .filter(
                                                Boolean
                                            );

                                    return {
                                        developer,
                                        skills:
                                            normalized,
                                    };

                                } catch (err) {

                                    console.error(
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


                const matchingDevelopers = [];

                const skillMap = new Map();


                results.forEach(
                    ({
                        developer,
                        skills,
                    }) => {

                        skills.forEach(
                            (skill) => {

                                const key =
                                    skill.name
                                        .trim()
                                        .toLowerCase();


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


                                const current =
                                    skillMap.get(
                                        key
                                    );


                                if (
                                    !current.developers.some(
                                        (item) =>
                                            item.id ===
                                            developer.id
                                    )
                                ) {

                                    current.developers.push(
                                        developer
                                    );

                                }


                                if (
                                    key ===
                                    decodedSkillName
                                        .trim()
                                        .toLowerCase()
                                ) {

                                    if (
                                        !matchingDevelopers.some(
                                            (item) =>
                                                item.id ===
                                                developer.id
                                        )
                                    ) {

                                        matchingDevelopers.push(
                                            developer
                                        );

                                    }

                                }

                            }
                        );

                    }
                );


                setDevelopers(
                    matchingDevelopers
                );


                setAllSkills(
                    Array.from(
                        skillMap.values()
                    )
                );

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to load skill details."
                );

            } finally {

                setLoading(false);

            }

        };


        loadSkillDetails();

    }, [decodedSkillName]);


    const currentSkill = useMemo(() => {

        return allSkills.find(
            (skill) =>
                skill.name
                    .trim()
                    .toLowerCase() ===
                decodedSkillName
                    .trim()
                    .toLowerCase()
        );

    }, [
        allSkills,
        decodedSkillName,
    ]);


    const relatedSkills = useMemo(() => {

        if (!currentSkill) {
            return [];
        }

        const currentDevelopers =
            new Set(
                developers.map(
                    (developer) =>
                        developer.id
                )
            );

        return allSkills
            .filter(
                (skill) =>
                    skill.name
                        .trim()
                        .toLowerCase() !==
                    decodedSkillName
                        .trim()
                        .toLowerCase()
            )
            .map((skill) => {

                const overlap =
                    skill.developers.filter(
                        (developer) =>
                            currentDevelopers.has(
                                developer.id
                            )
                    ).length;

                return {
                    ...skill,
                    overlap,
                };

            })
            .filter(
                (skill) =>
                    skill.overlap > 0
            )
            .sort(
                (a, b) =>
                    b.overlap - a.overlap
            )
            .slice(0, 6);

    }, [
        allSkills,
        developers,
        currentSkill,
        decodedSkillName,
    ]);


    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />

                    <p className="text-sm text-slate-500">
                        Loading skill...
                    </p>

                </div>

            </div>
        );

    }


    if (error) {

        return (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-12 text-center">

                <p className="text-sm text-red-400">
                    {error}
                </p>

                <button
                    onClick={() =>
                        navigate("/skills")
                    }
                    className="mt-4 text-sm text-violet-400 hover:text-violet-300"
                >
                    Back to Skills
                </button>

            </div>
        );

    }


    return (
        <div className="space-y-8">

            {/* Back */}

            <motion.button
                initial={{
                    opacity: 0,
                    x: -10,
                }}
                animate={{
                    opacity: 1,
                    x: 0,
                }}
                onClick={() =>
                    navigate("/skills")
                }
                className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >

                <ArrowLeft size={17} />

                Back to Skills

            </motion.button>


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

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-300">

                            <Code2 size={30} />

                        </div>


                        <div>

                            <div className="flex flex-wrap items-center gap-3">

                                <h1 className="text-3xl font-semibold tracking-tight text-white">

                                    {currentSkill?.name ||
                                        decodedSkillName}

                                </h1>

                                <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-400">

                                    {currentSkill?.category ||
                                        "Technology"}

                                </span>

                            </div>

                            <p className="mt-2 text-sm text-slate-400">

                                Developer expertise and
                                technology adoption.

                            </p>

                        </div>

                    </div>

                </div>

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

            </motion.section>


            {/* Stats */}

            <section className="grid gap-4 sm:grid-cols-3">

                <StatCard
                    icon={Users}
                    title="Developers"
                    value={developers.length}
                    description="Using this skill"
                />

                <StatCard
                    icon={Layers3}
                    title="Category"
                    value={
                        currentSkill?.category ||
                        "Technology"
                    }
                    description="Technology domain"
                />

                <StatCard
                    icon={Code2}
                    title="Related Skills"
                    value={
                        relatedSkills.length
                    }
                    description="Shared expertise"
                />

            </section>


            {/* Developers */}

            <section>

                <div className="mb-5">

                    <h2 className="text-xl font-semibold text-white">

                        Developers with this skill

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        Engineers who have this
                        technology in their skill profile.

                    </p>

                </div>


                {developers.length === 0 ? (

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

                        <Users
                            size={32}
                            className="mx-auto mb-4 text-slate-600"
                        />

                        <p className="text-sm text-slate-500">

                            No developers found
                            for this skill.

                        </p>

                    </div>

                ) : (

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                        {developers.map(
                            (developer, index) => (

                                <DeveloperSkillCard
                                    key={
                                        developer.id
                                    }
                                    developer={
                                        developer
                                    }
                                    index={
                                        index
                                    }
                                    onClick={() =>
                                        navigate(
                                            `/developers/${developer.id}`
                                        )
                                    }
                                />

                            )
                        )}

                    </div>

                )}

            </section>


            {/* Related Skills */}

            {relatedSkills.length > 0 && (

                <section>

                    <div className="mb-5">

                        <h2 className="text-xl font-semibold text-white">

                            Related skills

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                            Technologies commonly found
                            alongside {currentSkill?.name}.

                        </p>

                    </div>


                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                        {relatedSkills.map(
                            (skill, index) => (

                                <motion.button
                                    key={
                                        skill.name
                                    }
                                    initial={{
                                        opacity: 0,
                                        y: 15,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay:
                                            index *
                                            0.05,
                                    }}
                                    whileHover={{
                                        y: -4,
                                    }}
                                    onClick={() =>
                                        navigate(
                                            `/skills/${encodeURIComponent(
                                                skill.name
                                            )}`
                                        )
                                    }
                                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-violet-500/30 hover:bg-white/[0.05]"
                                >

                                    <div className="flex items-center justify-between">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">

                                                <Code2
                                                    size={18}
                                                />

                                            </div>

                                            <div>

                                                <p className="font-medium text-white">

                                                    {
                                                        skill.name
                                                    }

                                                </p>

                                                <p className="text-xs text-slate-500">

                                                    {
                                                        skill.category
                                                    }

                                                </p>

                                            </div>

                                        </div>

                                        <ArrowUpRight
                                            size={
                                                17
                                            }
                                            className="text-slate-600 transition group-hover:text-violet-400"
                                        />

                                    </div>


                                    <div className="mt-4 text-xs text-slate-500">

                                        Shared with{" "}

                                        <span className="font-medium text-violet-400">

                                            {
                                                skill.overlap
                                            }

                                        </span>{" "}

                                        developer
                                        {skill.overlap ===
                                        1
                                            ? ""
                                            : "s"}

                                    </div>

                                </motion.button>

                            )
                        )}

                    </div>

                </section>

            )}

        </div>
    );
}


/* -------------------------------- */
/* Stat Card                        */
/* -------------------------------- */

function StatCard({
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

                <div className="min-w-0">

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 truncate text-2xl font-semibold text-white">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {description}
                    </p>

                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">

                    <Icon size={20} />

                </div>

            </div>

        </motion.div>
    );
}


/* -------------------------------- */
/* Developer Skill Card             */
/* -------------------------------- */

function DeveloperSkillCard({
    developer,
    index,
    onClick,
}) {

    return (

        <motion.button
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                delay: index * 0.05,
            }}
            whileHover={{
                y: -5,
            }}
            onClick={onClick}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-violet-500/30 hover:bg-white/[0.05]"
        >

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-bold text-white">

                        {getInitials(
                            developer.name
                        )}

                    </div>

                    <div>

                        <h3 className="font-semibold text-white">

                            {developer.name}

                        </h3>

                        <p className="text-xs text-slate-500">

                            {developer.role}

                        </p>

                    </div>

                </div>

                <ArrowUpRight
                    size={18}
                    className="text-slate-600 transition group-hover:text-violet-400"
                />

            </div>


            <div className="mt-5 space-y-2">

                <div className="flex items-center gap-2 text-xs text-slate-400">

                    <BriefcaseBusiness
                        size={14}
                    />

                    {developer.company ||
                        "Company unavailable"}

                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">

                    <MapPin size={14} />

                    {developer.location ||
                        "Location unavailable"}

                </div>

            </div>


            <div className="mt-5 border-t border-white/5 pt-4">

                <span className="text-xs font-medium text-violet-400">

                    View developer →

                </span>

            </div>

        </motion.button>
    );
}