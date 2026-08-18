import { motion } from "framer-motion";

export default function StatCard({
    title,
    value,
    description,
    icon: Icon,
}) {

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            whileHover={{
                y: -4,
            }}
            transition={{
                duration: 0.2,
            }}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
        >

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                        {description}
                    </p>

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition group-hover:bg-violet-500/20">
                    {Icon && <Icon size={20} />}
                </div>

            </div>

        </motion.div>
    );
}