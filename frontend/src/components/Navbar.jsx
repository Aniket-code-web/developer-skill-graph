import { useEffect, useRef, useState } from "react";
import {
    Search,
    Bell,
    Command,
    UserRound,
    Brain,
    Building2,
    X,
    Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { searchGlobal } from "../api/developerApi";

export default function Navbar() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reference ONLY for the input
    const searchInputRef = useRef(null);

    // =====================================================
    // GLOBAL SEARCH
    // =====================================================

    useEffect(() => {
        const query = search.trim();

        if (!query) {
            setResults(null);
            setLoading(false);
            setError("");
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                setError("");

                const data = await searchGlobal(query);

                setResults(data);
            } catch (err) {
                console.error("Global search failed:", err);

                setResults(null);
                setError("Unable to search right now.");
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [search]);

    // =====================================================
    // KEYBOARD SHORTCUTS
    // =====================================================

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Escape
            if (event.key === "Escape") {
                setSearch("");
                setResults(null);
                setError("");

                searchInputRef.current?.blur();

                return;
            }

            // Ctrl + K / Cmd + K
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();

                searchInputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // =====================================================
    // CLOSE SEARCH
    // =====================================================

    const clearSearch = () => {
        setSearch("");
        setResults(null);
        setError("");
    };

    // =====================================================
    // RESULT CLICK HANDLERS
    // =====================================================

    const handleDeveloperClick = (developer) => {
        clearSearch();

        navigate(`/developers/${developer.id}`);
    };

    const handleSkillClick = () => {
        clearSearch();

        navigate("/graph");
    };

    const handleCompanyClick = () => {
        clearSearch();

        navigate("/");
    };

    // =====================================================
    // SEARCH RESULTS
    // =====================================================

    const developerResults = results?.developers || [];

    const skillResults = results?.skills || [];

    const companyResults = results?.companies || [];

    const hasResults =
        developerResults.length > 0 ||
        skillResults.length > 0 ||
        companyResults.length > 0;

    const hasQuery = search.trim().length > 0;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">

            <div className="flex h-20 items-center justify-between px-6 lg:px-8">

                {/* ================================================= */}
                {/* SEARCH */}
                {/* ================================================= */}

                <div className="relative w-full max-w-md">

                    {/* Search input */}

                    <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-500"
                    />

                    <input
                        ref={searchInputRef}
                        type="text"
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value);
                        }}
                        placeholder="Search developers, skills..."
                        autoComplete="off"
                        className="
                            w-full
                            rounded-xl
                            border
                            border-white/10
                            bg-white/5
                            py-2.5
                            pl-11
                            pr-20
                            text-sm
                            text-white
                            outline-none
                            placeholder:text-slate-500
                            transition
                            focus:border-violet-500/50
                            focus:bg-white/[0.07]
                        "
                    />

                    {/* ================================================= */}
                    {/* SEARCH CONTROLS */}
                    {/* ================================================= */}

                    <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">

                        {/* Loading */}

                        {loading && (
                            <Loader2
                                size={15}
                                className="animate-spin text-violet-400"
                            />
                        )}

                        {/* Clear */}

                        {!loading && hasQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                aria-label="Clear search"
                                className="
                                    rounded-md
                                    p-1
                                    text-slate-500
                                    transition
                                    hover:bg-white/10
                                    hover:text-white
                                "
                            >
                                <X size={14} />
                            </button>
                        )}

                        {/* Keyboard shortcut */}

                        {!hasQuery && (
                            <div
                                className="
                                    hidden
                                    items-center
                                    gap-1
                                    rounded-md
                                    border
                                    border-white/10
                                    bg-white/5
                                    px-2
                                    py-1
                                    text-[10px]
                                    text-slate-500
                                    sm:flex
                                "
                            >
                                <Command size={11} />
                                K
                            </div>
                        )}

                    </div>

                    {/* ================================================= */}
                    {/* SEARCH DROPDOWN */}
                    {/* ================================================= */}

                    <AnimatePresence>
                        {hasQuery && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -6,
                                    scale: 0.98,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -6,
                                    scale: 0.98,
                                }}
                                transition={{
                                    duration: 0.15,
                                }}
                                className="
                                    absolute
                                    left-0
                                    right-0
                                    top-[calc(100%+10px)]
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-slate-950
                                    shadow-2xl
                                    shadow-black/40
                                "
                            >

                                {/* ================================================= */}
                                {/* LOADING */}
                                {/* ================================================= */}

                                {loading && (
                                    <div className="flex items-center justify-center gap-2 px-5 py-8 text-sm text-slate-500">

                                        <Loader2
                                            size={16}
                                            className="animate-spin text-violet-400"
                                        />

                                        Searching...

                                    </div>
                                )}

                                {/* ================================================= */}
                                {/* ERROR */}
                                {/* ================================================= */}

                                {!loading && error && (
                                    <div className="px-5 py-8 text-center">

                                        <p className="text-sm text-red-400">
                                            {error}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setError("");
                                                setSearch(search);
                                            }}
                                            className="mt-3 text-xs text-slate-500 transition hover:text-white"
                                        >
                                            Try again
                                        </button>

                                    </div>
                                )}

                                {/* ================================================= */}
                                {/* RESULTS */}
                                {/* ================================================= */}

                                {!loading &&
                                    !error &&
                                    results &&
                                    hasResults && (
                                        <div className="max-h-[520px] overflow-y-auto p-2">

                                            {/* ================================================= */}
                                            {/* DEVELOPERS */}
                                            {/* ================================================= */}

                                            {developerResults.length > 0 && (
                                                <div className="mb-2">

                                                    <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                                        Developers
                                                    </div>

                                                    {developerResults.map(
                                                        (developer) => (
                                                            <button
                                                                key={
                                                                    developer.id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeveloperClick(
                                                                        developer
                                                                    )
                                                                }
                                                                className="
                                                                    flex
                                                                    w-full
                                                                    items-center
                                                                    gap-3
                                                                    rounded-xl
                                                                    px-3
                                                                    py-3
                                                                    text-left
                                                                    transition
                                                                    hover:bg-white/5
                                                                "
                                                            >

                                                                {/* Avatar */}

                                                                <div
                                                                    className="
                                                                        flex
                                                                        h-9
                                                                        w-9
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-lg
                                                                        bg-violet-500/10
                                                                        text-xs
                                                                        font-semibold
                                                                        text-violet-300
                                                                    "
                                                                >
                                                                    {developer.name
                                                                        ?.split(" ")
                                                                        .map(
                                                                            (
                                                                                word
                                                                            ) =>
                                                                                word[0]
                                                                        )
                                                                        .join("")
                                                                        .slice(
                                                                            0,
                                                                            2
                                                                        )}
                                                                </div>

                                                                {/* Developer info */}

                                                                <div className="min-w-0 flex-1">

                                                                    <p className="truncate text-sm font-medium text-white">
                                                                        {
                                                                            developer.name
                                                                        }
                                                                    </p>

                                                                    <p className="truncate text-xs text-slate-500">

                                                                        {
                                                                            developer.role
                                                                        }

                                                                        {developer.company &&
                                                                            ` · ${developer.company}`}

                                                                    </p>

                                                                </div>

                                                                <UserRound
                                                                    size={15}
                                                                    className="shrink-0 text-slate-600"
                                                                />

                                                            </button>
                                                        )
                                                    )}

                                                </div>
                                            )}

                                            {/* ================================================= */}
                                            {/* SKILLS */}
                                            {/* ================================================= */}

                                            {skillResults.length > 0 && (
                                                <div className="mb-2">

                                                    <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                                        Skills
                                                    </div>

                                                    {skillResults.map(
                                                        (skill) => (
                                                            <button
                                                                key={
                                                                    skill.name
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSkillClick(
                                                                        skill
                                                                    )
                                                                }
                                                                className="
                                                                    flex
                                                                    w-full
                                                                    items-center
                                                                    gap-3
                                                                    rounded-xl
                                                                    px-3
                                                                    py-3
                                                                    text-left
                                                                    transition
                                                                    hover:bg-white/5
                                                                "
                                                            >

                                                                {/* Icon */}

                                                                <div
                                                                    className="
                                                                        flex
                                                                        h-9
                                                                        w-9
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-lg
                                                                        bg-cyan-500/10
                                                                        text-cyan-400
                                                                    "
                                                                >
                                                                    <Brain
                                                                        size={17}
                                                                    />
                                                                </div>

                                                                {/* Skill info */}

                                                                <div className="min-w-0 flex-1">

                                                                    <p className="truncate text-sm font-medium text-white">
                                                                        {
                                                                            skill.name
                                                                        }
                                                                    </p>

                                                                    <p className="truncate text-xs text-slate-500">
                                                                        {skill.category ||
                                                                            "Technology"}
                                                                    </p>

                                                                </div>

                                                            </button>
                                                        )
                                                    )}

                                                </div>
                                            )}

                                            {/* ================================================= */}
                                            {/* COMPANIES */}
                                            {/* ================================================= */}

                                            {companyResults.length > 0 && (
                                                <div>

                                                    <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                                        Companies
                                                    </div>

                                                    {companyResults.map(
                                                        (company) => (
                                                            <button
                                                                key={
                                                                    company.name
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCompanyClick(
                                                                        company
                                                                    )
                                                                }
                                                                className="
                                                                    flex
                                                                    w-full
                                                                    items-center
                                                                    gap-3
                                                                    rounded-xl
                                                                    px-3
                                                                    py-3
                                                                    text-left
                                                                    transition
                                                                    hover:bg-white/5
                                                                "
                                                            >

                                                                {/* Icon */}

                                                                <div
                                                                    className="
                                                                        flex
                                                                        h-9
                                                                        w-9
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-lg
                                                                        bg-indigo-500/10
                                                                        text-indigo-400
                                                                    "
                                                                >
                                                                    <Building2
                                                                        size={17}
                                                                    />
                                                                </div>

                                                                {/* Company info */}

                                                                <div className="min-w-0 flex-1">

                                                                    <p className="truncate text-sm font-medium text-white">
                                                                        {
                                                                            company.name
                                                                        }
                                                                    </p>

                                                                    <p className="text-xs text-slate-500">
                                                                        Company
                                                                    </p>

                                                                </div>

                                                            </button>
                                                        )
                                                    )}

                                                </div>
                                            )}

                                        </div>
                                    )}

                                {/* ================================================= */}
                                {/* NO RESULTS */}
                                {/* ================================================= */}

                                {!loading &&
                                    !error &&
                                    results &&
                                    !hasResults && (
                                        <div className="px-5 py-10 text-center">

                                            <div
                                                className="
                                                    mx-auto
                                                    mb-3
                                                    flex
                                                    h-10
                                                    w-10
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-white/5
                                                    text-slate-500
                                                "
                                            >
                                                <Search size={18} />
                                            </div>

                                            <p className="text-sm font-medium text-white">
                                                No results found
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Try another developer,
                                                skill, or company.
                                            </p>

                                        </div>
                                    )}

                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

                {/* ================================================= */}
                {/* RIGHT SIDE */}
                {/* ================================================= */}

                <div className="ml-6 flex items-center gap-4">

                    {/* Notifications */}

                    <button
                        type="button"
                        aria-label="Notifications"
                        className="
                            relative
                            rounded-xl
                            p-2.5
                            text-slate-400
                            transition
                            hover:bg-white/5
                            hover:text-white
                        "
                    >
                        <Bell size={19} />

                        <span
                            className="
                                absolute
                                right-2
                                top-2
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-violet-500
                            "
                        />
                    </button>

                    <div className="hidden h-8 w-px bg-white/10 sm:block" />

                    {/* User */}

                    <div className="flex items-center gap-3">

                        <div className="hidden text-right sm:block">

                            <p className="text-sm font-medium text-white">
                                Ayush Panda
                            </p>

                            <p className="text-xs text-slate-500">
                                Developer
                            </p>

                        </div>

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-gradient-to-br
                                from-violet-500
                                to-indigo-500
                                text-xs
                                font-bold
                            "
                        >
                            AP
                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}