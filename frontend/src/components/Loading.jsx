import { motion } from "framer-motion";

export default function Loading({
    message = "Loading...",
}) {

    return (
        <div className="flex min-h-[50vh] items-center justify-center">

            <motion.div
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                className="flex flex-col items-center"
            >

                <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />

                <p className="mt-4 text-sm text-slate-500">
                    {message}
                </p>

            </motion.div>

        </div>
    );
}