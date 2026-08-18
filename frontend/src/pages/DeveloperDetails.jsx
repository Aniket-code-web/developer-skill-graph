import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowUpRight,
    BriefcaseBusiness,
    Building2,
    Code2,
    MapPin,
    Network,
    Users,
    UserRound,
} from "lucide-react";

import {
    getDeveloper,
    getDeveloperSkills,
    getSimilarDevelopers,
    getDeveloperConnections,
} from "../api/developerApi";


const proficiencyStyles = {
    Advanced: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Intermediate: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    Beginner: "border-sky-500/20 bg-sky-500/10 text-sky-400",
};


function SkillCard({ skill, index }) {
    const proficiencyClass =
        proficiencyStyles[skill.proficiency] ||
        "border-violet-500/20 bg-violet-500/10 text-violet-400";

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
            transition={{
                delay: index * 0.06,
            }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
        >
            <div className="flex items-start justify-between gap-3">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <Code2 size={18} />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            {skill.name}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                            {skill.category}
                        </p>
                    </div>

                </div>

                <span
                    className={`rounded-lg border px-2 py-1 text-[10px] font-medium ${proficiencyClass}`}
                >
                    {skill.proficiency}
                </span>

            </div>
        </motion.div>
    );
}


function SimilarDeveloperCard({ developer }) {
    return (
        <div className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-violet-500/20 hover:bg-white/[0.04]">

            <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-xs font-semibold text-violet-300">
                    {developer.name
                        ?.split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                </div>

                <div>
                    <p className="text-sm font-medium text-white">
                        {developer.name}
                    </p>

                    <p className="text-xs text-slate-500">
                        {developer.matching_skills} shared skills
                    </p>
                </div>

            </div>

            <ArrowUpRight
                size={16}
                className="text-slate-600 transition group-hover:text-violet-400"
            />

        </div>
    );
}


function ConnectionCard({ connection }) {
    return (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-cyan-500/20 hover:bg-white/[0.04]">

            <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Users size={17} />
                </div>

                <div>
                    <p className="text-sm font-medium text-white">
                        {connection.developer}
                    </p>

                    <p className="text-xs text-slate-500">
                        {connection.project}
                    </p>
                </div>

            </div>

            {connection.skills?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {connection.skills.map((skill) => (
                        <span
                            key={skill.name}
                            className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-400"
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>
            )}

        </div>
    );
}


export default function DeveloperDetails() {

    const { developerId } = useParams();
    const navigate = useNavigate();

    const [developer, setDeveloper] = useState(null);
    const [skills, setSkills] = useState([]);
    const [similarDevelopers, setSimilarDevelopers] = useState([]);
    const [connections, setConnections] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const loadDeveloper = async () => {

            try {

                setLoading(true);
                setError("");

                const [
                    developerData,
                    skillsData,
                    similarData,
                    connectionsData,
                ] = await Promise.all([
                    getDeveloper(developerId),
                    getDeveloperSkills(developerId),
                    getSimilarDevelopers(developerId),
                    getDeveloperConnections(developerId),
                ]);

                setDeveloper(developerData);
                setSkills(skillsData.skills || []);
                setSimilarDevelopers(
                    similarData.similar_developers || []
                );
                setConnections(
                    connectionsData.connections || []
                );

            } catch (err) {

                console.error(err);

                setError(
                    "Unable to load developer profile."
                );

            } finally {

                setLoading(false);

            }

        };

        loadDeveloper();

    }, [developerId]);


    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-sm text-slate-500">
                    Loading developer profile...
                </div>
            </div>
        );
    }


    if (error || !developer) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center">

                <p className="text-sm text-red-400">
                    {error || "Developer not found."}
                </p>

                <button
                    onClick={() => navigate("/")}
                    className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
                >
                    Back to dashboard
                </button>

            </div>
        );
    }


    return (
        <div className="space-y-6">

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
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
            >
                <ArrowLeft size={17} />
                Back to developers
            </motion.button>


            {/* Profile header */}
            <motion.section
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
            >

                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">

                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-violet-900/20">
                        {developer.name
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)}
                    </div>


                    <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                {developer.name}
                            </h1>

                            <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                                {developer.role}
                            </span>

                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">

                            <span className="flex items-center gap-2">
                                <Building2 size={15} />
                                {developer.company}
                            </span>

                            <span className="flex items-center gap-2">
                                <MapPin size={15} />
                                {developer.location}
                            </span>

                            <span className="flex items-center gap-2">
                                <BriefcaseBusiness size={15} />
                                {developer.experience} years experience
                            </span>

                        </div>

                    </div>

                </div>


                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

                <div className="absolute -bottom-24 right-32 h-52 w-52 rounded-full bg-indigo-600/10 blur-3xl" />

            </motion.section>


            {/* Main content */}
            <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">

                {/* Skills */}
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
                        delay: 0.1,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                >

                    <div className="mb-5 flex items-center justify-between">

                        <div>
                            <h2 className="font-semibold text-white">
                                Skills
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Technical capabilities
                            </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                            <Code2 size={18} />
                        </div>

                    </div>


                    <div className="grid gap-3 sm:grid-cols-2">
                        {skills.map((skill, index) => (
                            <SkillCard
                                key={skill.name}
                                skill={skill}
                                index={index}
                            />
                        ))}
                    </div>

                </motion.section>


                {/* Profile summary */}
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
                        delay: 0.15,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                >

                    <div className="mb-5 flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                            <UserRound size={18} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-white">
                                Profile
                            </h2>

                            <p className="text-xs text-slate-500">
                                Developer overview
                            </p>
                        </div>

                    </div>


                    <div className="space-y-4">

                        <div>
                            <p className="text-xs text-slate-500">
                                Role
                            </p>

                            <p className="mt-1 text-sm text-white">
                                {developer.role || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                Company
                            </p>

                            <p className="mt-1 text-sm text-white">
                                {developer.company || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                Location
                            </p>

                            <p className="mt-1 text-sm text-white">
                                {developer.location || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-500">
                                Experience
                            </p>

                            <p className="mt-1 text-sm text-white">
                                {developer.experience
                                    ? `${developer.experience} years`
                                    : "Not specified"}
                            </p>
                        </div>

                    </div>

                </motion.section>

            </div>


            {/* Similar + connections */}
            <div className="grid gap-6 lg:grid-cols-2">

                {/* Similar developers */}
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
                        delay: 0.2,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                >

                    <div className="mb-5 flex items-center justify-between">

                        <div>
                            <h2 className="font-semibold text-white">
                                Similar Developers
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Developers with overlapping skills
                            </p>
                        </div>

                        <Network
                            size={19}
                            className="text-violet-400"
                        />

                    </div>


                    <div className="space-y-2">

                        {similarDevelopers.length > 0 ? (
                            similarDevelopers.map(
                                (developer) => (
                                    <SimilarDeveloperCard
                                        key={developer.id}
                                        developer={developer}
                                    />
                                )
                            )
                        ) : (
                            <p className="py-6 text-center text-sm text-slate-500">
                                No similar developers found.
                            </p>
                        )}

                    </div>

                </motion.section>


                {/* Connections */}
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
                        delay: 0.25,
                    }}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6"
                >

                    <div className="mb-5 flex items-center justify-between">

                        <div>
                            <h2 className="font-semibold text-white">
                                Connections
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Project and developer relationships
                            </p>
                        </div>

                        <Users
                            size={19}
                            className="text-cyan-400"
                        />

                    </div>


                    <div className="space-y-3">

                        {connections.length > 0 ? (
                            connections.map(
                                (connection, index) => (
                                    <ConnectionCard
                                        key={`${connection.developer}-${index}`}
                                        connection={connection}
                                    />
                                )
                            )
                        ) : (
                            <p className="py-6 text-center text-sm text-slate-500">
                                No connections found.
                            </p>
                        )}

                    </div>

                </motion.section>

            </div>


            {/* Graph teaser */}
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
                    delay: 0.3,
                }}
                className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-6"
            >

                <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">

                    <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                            <Network size={21} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-white">
                                Explore the Skill Graph
                            </h2>

                            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                                Visualize how this developer connects
                                with skills, projects, and other
                                developers.
                            </p>
                        </div>

                    </div>

                    <button
                        onClick={() => navigate("/graph")}
                        className="shrink-0 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
                    >
                        Open Graph
                    </button>

                </div>

            </motion.section>

        </div>
    );
}