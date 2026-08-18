import {
    LayoutDashboard,
    Users,
    Brain,
    Network,
    Code2,
    Settings,
} from "lucide-react";

import { motion } from "framer-motion";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";


const menuItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
    },
    {
        label: "Developers",
        icon: Users,
        path: "/developers",
    },
    {
        label: "Skills",
        icon: Brain,
        path: "/skills",
    },
    {
        label: "Skill Graph",
        icon: Network,
        path: "/graph",
    },
];


export default function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();


    const isActive = (path) => {

        if (path === "/") {
            return location.pathname === "/";
        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(
                `${path}/`
            )
        );
    };


    return (

        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/10 bg-slate-950 lg:block">

            <div className="flex h-full flex-col">


                {/* Logo */}

                <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">

                        <Code2 size={22} />

                    </div>

                    <div>

                        <h1 className="text-sm font-semibold text-white">

                            SkillGraph

                        </h1>

                        <p className="text-xs text-slate-500">

                            Developer Intelligence

                        </p>

                    </div>

                </div>


                {/* Navigation */}

                <nav className="flex-1 space-y-2 px-4 py-6">

                    <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">

                        Workspace

                    </p>


                    {menuItems.map(
                        (item, index) => {

                            const Icon =
                                item.icon;

                            const active =
                                isActive(
                                    item.path
                                );


                            return (

                                <motion.button
                                    key={
                                        item.label
                                    }
                                    initial={{
                                        opacity: 0,
                                        x: -10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    transition={{
                                        delay:
                                            index *
                                            0.05,
                                    }}
                                    onClick={() =>
                                        navigate(
                                            item.path
                                        )
                                    }
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                                        active
                                            ? "bg-violet-600/15 text-violet-400"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >

                                    <Icon
                                        size={18}
                                    />

                                    <span>
                                        {
                                            item.label
                                        }
                                    </span>


                                    {active && (

                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />

                                    )}

                                </motion.button>

                            );
                        }
                    )}

                </nav>


                {/* Bottom */}

                <div className="border-t border-white/10 p-4">

                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">

                        <Settings
                            size={18}
                        />

                        Settings

                    </button>


                    <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-sm font-semibold">

                            AM

                        </div>


                        <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-white">

                                Aniket Muni

                            </p>

                            <p className="truncate text-xs text-slate-500">

                                Developer

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </aside>
    );
}