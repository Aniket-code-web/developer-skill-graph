import { motion } from "framer-motion";
import {
    MapPin,
    BriefcaseBusiness,
    ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeveloperCard({
    developer,
    index = 0,
}) {

    const navigate = useNavigate();

    const initials =
        developer?.name
            ?.split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "DE";

    return (
        <motion.button
            type="button"
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                delay: index * 0.06,
                duration: 0.35,
            }}
            whileHover={{
                y: -5,
            }}
            onClick={() =>
                navigate(
                    `/developers/${developer.id}`
                )
            }
            className="group w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition hover:border-violet-500/30 hover:bg-white/[0.05]"
        >

            <div className="flex items-start justify-between">

                <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-sm font-semibold text-violet-300">
                        {initials}
                    </div>

                    <div className="min-w-0">

                        <h3 className="truncate font-semibold text-white">
                            {developer?.name || "Unknown Developer"}
                        </h3>

                        <p className="truncate text-xs text-slate-500">
                            {developer?.role || "Developer"}
                        </p>

                    </div>

                </div>

                <ArrowUpRight
                    size={18}
                    className="shrink-0 text-slate-600 transition group-hover:text-violet-400"
                />

            </div>

            <div className="mt-5 space-y-2">

                <div className="flex items-center gap-2 text-xs text-slate-400">

                    <BriefcaseBusiness
                        size={14}
                        className="shrink-0"
                    />

                    <span className="truncate">
                        {developer?.company ||
                            "Company unavailable"}
                    </span>

                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">

                    <MapPin
                        size={14}
                        className="shrink-0"
                    />

                    <span className="truncate">
                        {developer?.location ||
                            "Location unavailable"}
                    </span>

                </div>

            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">

                <span className="text-xs text-slate-500">
                    {developer?.experience ?? 0} years experience
                </span>

                <span className="text-xs font-medium text-violet-400">
                    View profile →
                </span>

            </div>

        </motion.button>
    );
}