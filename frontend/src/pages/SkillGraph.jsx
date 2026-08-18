import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Handle,
    Position,
    MarkerType,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
    Network,
    Users,
    Code2,
    Search,
    ArrowLeft,
    Layers3,
    RotateCcw,
    Building2,
    MapPin,
    X,
    BriefcaseBusiness,
    ChevronRight,
    ExternalLink,
} from "lucide-react";

import {
    motion,
    AnimatePresence,
} from "framer-motion";

import { getGraph } from "../api/developerApi";


/* =========================================================
   CONSTANTS
========================================================= */

const DEVELOPER_COLUMN_X = 0;
const COMPANY_COLUMN_X = 530;
const SKILL_COLUMN_X = 1060;

const DEVELOPER_COLUMN_GAP = 410;
const COMPANY_COLUMN_GAP = 360;
const SKILL_COLUMN_GAP = 360;

const DEVELOPER_ROW_GAP = 220;
const COMPANY_ROW_GAP = 200;
const SKILL_ROW_GAP = 190;


/* =========================================================
   HELPERS
========================================================= */

function getInitials(name = "") {
    return name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function normalizeValue(value) {
    return String(value ?? "").toLowerCase();
}


/* =========================================================
   DEVELOPER NODE
========================================================= */

function DeveloperNode({ data }) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.92,
            }}
            animate={{
                opacity: data.dimmed ? 0.18 : 1,
                scale: data.selected ? 1.04 : 1,
            }}
            transition={{
                duration: 0.2,
            }}
            onClick={(event) => {
                event.stopPropagation();
                data.onSelect(data.id);
            }}
            className={`
                relative
                min-w-[250px]
                max-w-[250px]
                cursor-pointer
                rounded-2xl
                border
                p-4
                shadow-2xl
                backdrop-blur-xl
                transition-all
                duration-200

                ${
                    data.selected
                        ? `
                            border-violet-400
                            bg-violet-950/80
                            shadow-violet-500/20
                        `
                        : `
                            border-violet-500/20
                            bg-slate-950/95
                            hover:border-violet-400/50
                            hover:bg-slate-900
                        `
                }
            `}
        >
            <Handle
                type="source"
                position={Position.Right}
                className="
                    !h-2
                    !w-2
                    !border-0
                    !bg-violet-400
                "
            />

            <Handle
                type="target"
                position={Position.Left}
                className="
                    !h-2
                    !w-2
                    !border-0
                    !bg-violet-400
                "
            />

            {data.searchMatch && !data.selected && (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.7,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className="
                        absolute
                        -right-1
                        -top-1
                        h-3
                        w-3
                        rounded-full
                        bg-cyan-400
                        shadow-lg
                        shadow-cyan-500/50
                    "
                />
            )}

            {data.selected && (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.7,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className="
                        absolute
                        -right-1
                        -top-1
                        h-3
                        w-3
                        rounded-full
                        bg-violet-400
                        shadow-lg
                        shadow-violet-500/50
                    "
                />
            )}

            <div className="flex items-center gap-3">
                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-violet-500/15
                        text-sm
                        font-bold
                        text-violet-300
                    "
                >
                    {data.initials}
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                        {data.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                        {data.role || "Developer"}
                    </p>
                </div>
            </div>

            <div className="mt-4 border-t border-white/5 pt-3">
                <div className="flex items-center gap-2">
                    <Building2
                        size={13}
                        className="shrink-0 text-slate-500"
                    />

                    <p className="truncate text-xs text-slate-400">
                        {data.company || "Company unavailable"}
                    </p>
                </div>

                {data.location && (
                    <div className="mt-2 flex items-center gap-2">
                        <MapPin
                            size={13}
                            className="shrink-0 text-slate-600"
                        />

                        <p className="truncate text-[11px] text-slate-600">
                            {data.location}
                        </p>
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();

                    navigate(
                        `/developers/${data.id}`
                    );
                }}
                className="
                    mt-3
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-1.5
                    rounded-lg
                    border
                    border-white/5
                    bg-white/[0.03]
                    py-1.5
                    text-[10px]
                    font-medium
                    text-slate-500
                    transition
                    hover:border-violet-500/20
                    hover:bg-violet-500/10
                    hover:text-violet-300
                "
            >
                View profile

                <ExternalLink size={10} />
            </button>
        </motion.div>
    );
}


/* =========================================================
   COMPANY NODE
========================================================= */

function CompanyNode({ data }) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.92,
            }}
            animate={{
                opacity: data.dimmed ? 0.18 : 1,
                scale: data.selected ? 1.04 : 1,
            }}
            transition={{
                duration: 0.2,
            }}
            onClick={(event) => {
                event.stopPropagation();
                data.onSelect(data.id);
            }}
            className={`
                relative
                min-w-[230px]
                max-w-[230px]
                cursor-pointer
                rounded-2xl
                border
                bg-slate-950/95
                p-4
                shadow-2xl
                backdrop-blur-xl
                transition-all

                ${
                    data.selected
                        ? `
                            border-amber-400
                            bg-amber-950/60
                            shadow-amber-500/20
                        `
                        : `
                            border-amber-500/20
                            hover:border-amber-400/40
                            hover:bg-slate-900
                        `
                }
            `}
        >
            <Handle
                type="target"
                position={Position.Left}
                className="
                    !h-2
                    !w-2
                    !border-0
                    !bg-amber-400
                "
            />

            <Handle
                type="source"
                position={Position.Right}
                className="
                    !h-2
                    !w-2
                    !border-0
                    !bg-amber-400
                "
            />

            {data.selected && (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.7,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className="
                        absolute
                        -right-1
                        -top-1
                        h-3
                        w-3
                        rounded-full
                        bg-amber-400
                        shadow-lg
                        shadow-amber-500/50
                    "
                />
            )}

            {data.searchMatch && !data.selected && (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.7,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className="
                        absolute
                        -right-1
                        -top-1
                        h-3
                        w-3
                        rounded-full
                        bg-cyan-400
                        shadow-lg
                        shadow-cyan-500/50
                    "
                />
            )}

            <div className="flex items-center gap-3">
                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-amber-500/10
                        text-amber-400
                    "
                >
                    <Building2 size={20} />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                        {data.name}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] uppercase tracking-wider text-slate-600">
                        Company
                    </p>
                </div>
            </div>

            <div className="mt-4 border-t border-white/5 pt-3">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-600">
                        Developers
                    </span>

                    <span
                        className="
                            rounded-full
                            bg-violet-500/10
                            px-2
                            py-1
                            text-[10px]
                            font-medium
                            text-violet-300
                        "
                    >
                        {data.developerCount}
                    </span>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-600">
                        Technologies
                    </span>

                    <span
                        className="
                            rounded-full
                            bg-cyan-500/10
                            px-2
                            py-1
                            text-[10px]
                            font-medium
                            text-cyan-400
                        "
                    >
                        {data.skillCount}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}


/* =========================================================
   SKILL NODE
========================================================= */

function SkillNode({ data }) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.92,
            }}
            animate={{
                opacity: data.dimmed ? 0.18 : 1,
                scale: data.selected ? 1.04 : 1,
            }}
            transition={{
                duration: 0.2,
            }}
            onClick={(event) => {
                event.stopPropagation();
                data.onSelect(data.id);
            }}
            className={`
                relative
                min-w-[200px]
                max-w-[200px]
                cursor-pointer
                rounded-2xl
                border
                bg-slate-950/95
                p-4
                shadow-2xl
                backdrop-blur-xl
                transition-all

                ${
                    data.selected
                        ? `
                            border-cyan-400
                            bg-cyan-950/60
                            shadow-cyan-500/20
                        `
                        : `
                            border-cyan-500/20
                            hover:border-cyan-400/40
                            hover:bg-slate-900
                        `
                }
            `}
        >
            <Handle
                type="target"
                position={Position.Left}
                className="
                    !h-2
                    !w-2
                    !border-0
                    !bg-cyan-400
                "
            />

            <Handle
                type="source"
                position={Position.Right}
                className="
                    !h-2
                    !w-2
                    !border-0
                    !bg-cyan-400
                "
            />

            {data.selected && (
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.7,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className="
                        absolute
                        -right-1
                        -top-1
                        h-3
                        w-3
                        rounded-full
                        bg-cyan-400
                        shadow-lg
                        shadow-cyan-500/50
                    "
                />
            )}

            <div className="flex items-center gap-3">
                <div
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-cyan-500/10
                        text-cyan-400
                    "
                >
                    <Code2 size={18} />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                        {data.name}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] uppercase tracking-wider text-slate-600">
                        {data.category || "Technology"}
                    </p>
                </div>
            </div>

            <div className="mt-4 border-t border-white/5 pt-3">
                <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-600">
                        Used by
                    </span>

                    <span
                        className="
                            rounded-full
                            bg-cyan-500/10
                            px-2
                            py-1
                            text-[10px]
                            font-medium
                            text-cyan-400
                        "
                    >
                        {data.developerCount} developers
                    </span>
                </div>
            </div>
        </motion.div>
    );
}


/* =========================================================
   NODE TYPES
========================================================= */

const nodeTypes = {
    developer: DeveloperNode,
    company: CompanyNode,
    skill: SkillNode,
};


/* =========================================================
   FLOW WRAPPER
========================================================= */

function SkillGraphFlow({
    nodes,
    edges,
    nodeTypes,
    onPaneClick,
}) {
    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
                padding: 0.22,
                duration: 500,
            }}
            minZoom={0.18}
            maxZoom={2}
            defaultEdgeOptions={{
                type: "smoothstep",
            }}
            onPaneClick={onPaneClick}
            proOptions={{
                hideAttribution: true,
            }}
        >
            <Background
                gap={24}
                size={1}
                color="#1e293b"
            />

            <Controls
                showInteractive={false}
                className="
                    !overflow-hidden
                    !rounded-xl
                    !border-white/10
                    !bg-slate-950
                "
            />

            <MiniMap
                nodeColor={(node) => {
                    if (node.type === "developer") {
                        return "#7c3aed";
                    }

                    if (node.type === "company") {
                        return "#f59e0b";
                    }

                    return "#06b6d4";
                }}
                maskColor="rgba(2, 6, 23, 0.78)"
                className="
                    !overflow-hidden
                    !rounded-xl
                    !border-white/10
                    !bg-slate-950
                "
            />
        </ReactFlow>
    );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function SkillGraph() {
    const navigate = useNavigate();

    const [graphData, setGraphData] = useState({
        nodes: [],
        edges: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedNode, setSelectedNode] = useState(null);


    /* =====================================================
       LOAD GRAPH
    ===================================================== */

    const loadGraph = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getGraph();

            setGraphData({
                nodes: Array.isArray(data?.nodes)
                    ? data.nodes
                    : [],
                edges: Array.isArray(data?.edges)
                    ? data.edges
                    : [],
            });
        } catch (err) {
            console.error(
                "Failed to load graph:",
                err
            );

            setError(
                "Unable to load the developer skill graph."
            );
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        loadGraph();
    }, [loadGraph]);


    /* =====================================================
       COUNTS
    ===================================================== */

    const developerCount = useMemo(() => {
        return graphData.nodes.filter(
            (node) =>
                node.type === "developer"
        ).length;
    }, [graphData.nodes]);


    const companyCount = useMemo(() => {
        return graphData.nodes.filter(
            (node) =>
                node.type === "company"
        ).length;
    }, [graphData.nodes]);


    const skillCount = useMemo(() => {
        return graphData.nodes.filter(
            (node) =>
                node.type === "skill"
        ).length;
    }, [graphData.nodes]);


    const developerConnectionCount = useMemo(() => {
        return graphData.edges.filter(
            (edge) =>
                edge.type === "WORKED_WITH"
        ).length;
    }, [graphData.edges]);


    /* =====================================================
       NODE MAP
    ===================================================== */

    const nodeMap = useMemo(() => {
        const map = new Map();

        graphData.nodes.forEach((node) => {
            map.set(node.id, node);
        });

        return map;
    }, [graphData.nodes]);


    /* =====================================================
       CONNECTION MAP
    ===================================================== */

    const connectionMap = useMemo(() => {
        const map = new Map();

        const addConnection = (
            first,
            second
        ) => {
            if (!map.has(first)) {
                map.set(
                    first,
                    new Set()
                );
            }

            map.get(first).add(second);
        };

        graphData.edges.forEach((edge) => {
            addConnection(
                edge.source,
                edge.target
            );

            addConnection(
                edge.target,
                edge.source
            );
        });

        return map;
    }, [graphData.edges]);


    /* =====================================================
       SELECTED NODE
    ===================================================== */

    const selectedNodeData = useMemo(() => {
        if (!selectedNode) {
            return null;
        }

        return (
            nodeMap.get(selectedNode) ||
            null
        );
    }, [
        selectedNode,
        nodeMap,
    ]);


    /* =====================================================
       SELECTED RELATIONSHIPS
    ===================================================== */

    const selectedRelationships = useMemo(() => {
        if (
            !selectedNode ||
            !selectedNodeData
        ) {
            return {
                skills: [],
                developers: [],
                companies: [],
            };
        }

        const skills = [];
        const developers = [];
        const companies = [];

        const seenSkills = new Set();
        const seenDevelopers = new Set();
        const seenCompanies = new Set();

        graphData.edges.forEach((edge) => {
            const sourceNode =
                nodeMap.get(edge.source);

            const targetNode =
                nodeMap.get(edge.target);


            /* ---------------------------------------------
               KNOWS
            --------------------------------------------- */

            if (edge.type === "KNOWS") {

                if (
                    selectedNodeData.type ===
                    "developer"
                ) {
                    let skill = null;

                    if (
                        edge.source ===
                            selectedNode &&
                        targetNode?.type ===
                            "skill"
                    ) {
                        skill = targetNode;
                    }

                    if (
                        edge.target ===
                            selectedNode &&
                        sourceNode?.type ===
                            "skill"
                    ) {
                        skill = sourceNode;
                    }

                    if (
                        skill &&
                        !seenSkills.has(skill.id)
                    ) {
                        seenSkills.add(skill.id);

                        skills.push({
                            ...skill,
                            proficiency:
                                edge.proficiency ||
                                "Unknown",
                        });
                    }
                }


                if (
                    selectedNodeData.type ===
                    "skill"
                ) {
                    let developer = null;

                    if (
                        edge.source ===
                            selectedNode &&
                        targetNode?.type ===
                            "developer"
                    ) {
                        developer = targetNode;
                    }

                    if (
                        edge.target ===
                            selectedNode &&
                        sourceNode?.type ===
                            "developer"
                    ) {
                        developer = sourceNode;
                    }

                    if (
                        developer &&
                        !seenDevelopers.has(
                            developer.id
                        )
                    ) {
                        seenDevelopers.add(
                            developer.id
                        );

                        developers.push({
                            ...developer,
                        });
                    }
                }
            }


            /* ---------------------------------------------
               WORKED_WITH
            --------------------------------------------- */

            if (
                edge.type ===
                "WORKED_WITH"
            ) {
                if (
                    selectedNodeData.type ===
                    "developer"
                ) {
                    let developer = null;

                    if (
                        edge.source ===
                            selectedNode &&
                        nodeMap.get(
                            edge.target
                        )?.type === "developer"
                    ) {
                        developer =
                            nodeMap.get(
                                edge.target
                            );
                    }

                    if (
                        edge.target ===
                            selectedNode &&
                        nodeMap.get(
                            edge.source
                        )?.type === "developer"
                    ) {
                        developer =
                            nodeMap.get(
                                edge.source
                            );
                    }

                    if (
                        developer &&
                        !seenDevelopers.has(
                            developer.id
                        )
                    ) {
                        seenDevelopers.add(
                            developer.id
                        );

                        developers.push({
                            ...developer,
                            project:
                                edge.project,
                        });
                    }
                }
            }


            /* ---------------------------------------------
               WORKS_AT
            --------------------------------------------- */

            if (
                edge.type ===
                "WORKS_AT"
            ) {
                if (
                    selectedNodeData.type ===
                    "developer"
                ) {
                    let company = null;

                    if (
                        edge.source ===
                            selectedNode &&
                        targetNode?.type ===
                            "company"
                    ) {
                        company = targetNode;
                    }

                    if (
                        edge.target ===
                            selectedNode &&
                        sourceNode?.type ===
                            "company"
                    ) {
                        company = sourceNode;
                    }

                    if (
                        company &&
                        !seenCompanies.has(
                            company.id
                        )
                    ) {
                        seenCompanies.add(
                            company.id
                        );

                        companies.push({
                            ...company,
                            role:
                                edge.role ||
                                selectedNodeData.role,
                        });
                    }
                }


                if (
                    selectedNodeData.type ===
                    "company"
                ) {
                    let developer = null;

                    if (
                        edge.source ===
                            selectedNode &&
                        targetNode?.type ===
                            "developer"
                    ) {
                        developer = targetNode;
                    }

                    if (
                        edge.target ===
                            selectedNode &&
                        sourceNode?.type ===
                            "developer"
                    ) {
                        developer = sourceNode;
                    }

                    if (
                        developer &&
                        !seenDevelopers.has(
                            developer.id
                        )
                    ) {
                        seenDevelopers.add(
                            developer.id
                        );

                        developers.push({
                            ...developer,
                            role:
                                edge.role ||
                                developer.role,
                        });
                    }
                }
            }


            /* ---------------------------------------------
               USES
            --------------------------------------------- */

            if (
                edge.type ===
                "USES"
            ) {
                if (
                    selectedNodeData.type ===
                    "company"
                ) {
                    let skill = null;

                    if (
                        edge.source ===
                            selectedNode &&
                        targetNode?.type ===
                            "skill"
                    ) {
                        skill = targetNode;
                    }

                    if (
                        edge.target ===
                            selectedNode &&
                        sourceNode?.type ===
                            "skill"
                    ) {
                        skill = sourceNode;
                    }

                    if (
                        skill &&
                        !seenSkills.has(
                            skill.id
                        )
                    ) {
                        seenSkills.add(skill.id);

                        skills.push({
                            ...skill,
                            usage:
                                edge.usage ||
                                edge.proficiency ||
                                "Used",
                        });
                    }
                }


                if (
                    selectedNodeData.type ===
                    "skill"
                ) {
                    let company = null;

                    if (
                        edge.source ===
                            selectedNode &&
                        targetNode?.type ===
                            "company"
                    ) {
                        company = targetNode;
                    }

                    if (
                        edge.target ===
                            selectedNode &&
                        sourceNode?.type ===
                            "company"
                    ) {
                        company = sourceNode;
                    }

                    if (
                        company &&
                        !seenCompanies.has(
                            company.id
                        )
                    ) {
                        seenCompanies.add(
                            company.id
                        );

                        companies.push({
                            ...company,
                        });
                    }
                }
            }
        });

        return {
            skills,
            developers,
            companies,
        };
    }, [
        selectedNode,
        selectedNodeData,
        graphData.edges,
        nodeMap,
    ]);


    /* =====================================================
       SEARCH MATCHES
    ===================================================== */

    const directSearchMatches = useMemo(() => {
        const query = search
            .trim()
            .toLowerCase();

        const matches = new Set();

        if (!query) {
            return matches;
        }

        graphData.nodes.forEach((node) => {
            const searchable = [
                node.name,
                node.role,
                node.company,
                node.location,
                node.category,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            if (
                searchable.includes(query)
            ) {
                matches.add(node.id);
            }
        });

        return matches;
    }, [
        search,
        graphData.nodes,
    ]);


    const searchMatches = useMemo(() => {
        const matches = new Set(
            directSearchMatches
        );

        if (
            directSearchMatches.size === 0
        ) {
            return matches;
        }

        graphData.edges.forEach((edge) => {
            if (
                directSearchMatches.has(
                    edge.source
                )
            ) {
                matches.add(edge.target);
            }

            if (
                directSearchMatches.has(
                    edge.target
                )
            ) {
                matches.add(edge.source);
            }
        });

        return matches;
    }, [
        directSearchMatches,
        graphData.edges,
    ]);


    const searchResultCount =
        directSearchMatches.size;


    /* =====================================================
       DYNAMIC POSITION
    ===================================================== */

    const getDynamicPosition = useCallback(
        (
            index,
            total,
            side
        ) => {
            const rowGap =
                side === "developer"
                    ? DEVELOPER_ROW_GAP
                    : side === "company"
                        ? COMPANY_ROW_GAP
                        : SKILL_ROW_GAP;

            const columnGap =
                side === "developer"
                    ? DEVELOPER_COLUMN_GAP
                    : side === "company"
                        ? COMPANY_COLUMN_GAP
                        : SKILL_COLUMN_GAP;

            const maxRows = 4;

            const rows = Math.min(
                total,
                maxRows
            );

            const column = Math.floor(
                index / maxRows
            );

            const row =
                index % maxRows;

            const contentHeight =
                (rows - 1) * rowGap;

            let x;

            if (side === "developer") {
                x =
                    DEVELOPER_COLUMN_X +
                    column * columnGap;
            } else if (
                side === "company"
            ) {
                x =
                    COMPANY_COLUMN_X +
                    column * columnGap;
            } else {
                x =
                    SKILL_COLUMN_X +
                    column * columnGap;
            }

            const y =
                row * rowGap -
                contentHeight / 2;

            return {
                x,
                y,
            };
        },
        []
    );


    /* =====================================================
       FLOW DATA
    ===================================================== */

    const flowData = useMemo(() => {

        const developerNodes =
            graphData.nodes.filter(
                (node) =>
                    node.type ===
                    "developer"
            );

        const companyNodes =
            graphData.nodes.filter(
                (node) =>
                    node.type ===
                    "company"
            );

        const skillNodes =
            graphData.nodes.filter(
                (node) =>
                    node.type ===
                    "skill"
            );


        /* ---------------------------------------------
           DEVELOPERS
        --------------------------------------------- */

        const developers =
            developerNodes.map(
                (node, index) => {

                    const initials =
                        getInitials(
                            node.name
                        );

                    const connected =
                        selectedNode
                            ? connectionMap
                                  .get(
                                      selectedNode
                                  )
                                  ?.has(
                                      node.id
                                  )
                            : false;

                    const selected =
                        selectedNode ===
                        node.id;

                    const searchActive =
                        Boolean(
                            search.trim()
                        );

                    const searchMatch =
                        searchMatches.has(
                            node.id
                        );

                    const dimmedBySelection =
                        selectedNode !==
                            null &&
                        !selected &&
                        !connected;

                    const dimmedBySearch =
                        searchActive &&
                        !searchMatch;

                    return {
                        id: node.id,

                        type: "developer",

                        position:
                            getDynamicPosition(
                                index,
                                developerNodes.length,
                                "developer"
                            ),

                        data: {
                            id: node.id,
                            name: node.name,
                            role: node.role,
                            company:
                                node.company,
                            location:
                                node.location,
                            initials,
                            selected,
                            searchMatch,

                            dimmed:
                                dimmedBySelection ||
                                dimmedBySearch,

                            onSelect:
                                setSelectedNode,
                        },
                    };
                }
            );


        /* ---------------------------------------------
           COMPANIES
        --------------------------------------------- */

        const companies =
            companyNodes.map(
                (node, index) => {

                    const connected =
                        selectedNode
                            ? connectionMap
                                  .get(
                                      selectedNode
                                  )
                                  ?.has(
                                      node.id
                                  )
                            : false;

                    const selected =
                        selectedNode ===
                        node.id;

                    const searchActive =
                        Boolean(
                            search.trim()
                        );

                    const searchMatch =
                        searchMatches.has(
                            node.id
                        );

                    const dimmedBySelection =
                        selectedNode !==
                            null &&
                        !selected &&
                        !connected;

                    const dimmedBySearch =
                        searchActive &&
                        !searchMatch;


                    const developerCount =
                        graphData.edges.filter(
                            (edge) =>
                                edge.type ===
                                    "WORKS_AT" &&
                                (
                                    edge.source ===
                                        node.id ||
                                    edge.target ===
                                        node.id
                                )
                        ).length;


                    const skillCount =
                        graphData.edges.filter(
                            (edge) =>
                                edge.type ===
                                    "USES" &&
                                (
                                    edge.source ===
                                        node.id ||
                                    edge.target ===
                                        node.id
                                )
                        ).length;


                    return {
                        id: node.id,

                        type: "company",

                        position:
                            getDynamicPosition(
                                index,
                                companyNodes.length,
                                "company"
                            ),

                        data: {
                            id: node.id,
                            name: node.name,

                            developerCount,
                            skillCount,

                            selected,
                            searchMatch,

                            dimmed:
                                dimmedBySelection ||
                                dimmedBySearch,

                            onSelect:
                                setSelectedNode,
                        },
                    };
                }
            );


        /* ---------------------------------------------
           SKILLS
        --------------------------------------------- */

        const skills =
            skillNodes.map(
                (node, index) => {

                    const developerCount =
                        graphData.edges.filter(
                            (edge) =>
                                edge.type ===
                                    "KNOWS" &&
                                (
                                    edge.source ===
                                        node.id ||
                                    edge.target ===
                                        node.id
                                )
                        ).length;


                    const connected =
                        selectedNode
                            ? connectionMap
                                  .get(
                                      selectedNode
                                  )
                                  ?.has(
                                      node.id
                                  )
                            : false;

                    const selected =
                        selectedNode ===
                        node.id;

                    const searchActive =
                        Boolean(
                            search.trim()
                        );

                    const searchMatch =
                        searchMatches.has(
                            node.id
                        );

                    const dimmedBySelection =
                        selectedNode !==
                            null &&
                        !selected &&
                        !connected;

                    const dimmedBySearch =
                        searchActive &&
                        !searchMatch;

                    return {
                        id: node.id,

                        type: "skill",

                        position:
                            getDynamicPosition(
                                index,
                                skillNodes.length,
                                "skill"
                            ),

                        data: {
                            id: node.id,
                            name: node.name,
                            category:
                                node.category,

                            developerCount,

                            selected,
                            searchMatch,

                            dimmed:
                                dimmedBySelection ||
                                dimmedBySearch,

                            onSelect:
                                setSelectedNode,
                        },
                    };
                }
            );


        /* ---------------------------------------------
           EDGES
        --------------------------------------------- */

        const edges =
            graphData.edges.map(
                (edge) => {

                    const selectedActive =
                        selectedNode ===
                            null ||
                        edge.source ===
                            selectedNode ||
                        edge.target ===
                            selectedNode;


                    const searchActive =
                        Boolean(
                            search.trim()
                        );


                    const searchEdgeActive =
                        !searchActive ||
                        searchMatches.has(
                            edge.source
                        ) ||
                        searchMatches.has(
                            edge.target
                        );


                    const active =
                        selectedActive &&
                        searchEdgeActive;


                    const isWorkedWith =
                        edge.type ===
                        "WORKED_WITH";


                    const isWorksAt =
                        edge.type ===
                        "WORKS_AT";


                    const isUses =
                        edge.type ===
                        "USES";


                    let edgeColor =
                        "#334155";


                    if (isWorkedWith) {
                        edgeColor =
                            "#06b6d4";
                    } else if (isWorksAt) {
                        edgeColor =
                            "#f59e0b";
                    } else if (isUses) {
                        edgeColor =
                            "#22d3ee";
                    } else if (active) {
                        edgeColor =
                            "#7c3aed";
                    }


                    let label =
                        edge.proficiency;


                    if (isWorkedWith) {
                        label =
                            edge.project ||
                            "Worked together";
                    }


                    if (isWorksAt) {
                        label =
                            edge.role ||
                            "Works at";
                    }


                    if (isUses) {
                        label =
                            edge.usage ||
                            "Uses";
                    }


                    return {
                        id: edge.id,

                        source:
                            edge.source,

                        target:
                            edge.target,

                        type: "smoothstep",

                        animated:
                            active,

                        style: {
                            stroke:
                                edgeColor,

                            strokeWidth:
                                isWorkedWith ||
                                isWorksAt ||
                                isUses
                                    ? active
                                        ? 3
                                        : 1.5
                                    : active
                                        ? 2.5
                                        : 1,

                            opacity:
                                active
                                    ? 1
                                    : 0.12,

                            strokeDasharray:
                                isWorkedWith
                                    ? "7 5"
                                    : isWorksAt
                                        ? "5 4"
                                        : isUses
                                            ? "3 4"
                                            : undefined,
                        },

                        markerEnd: {
                            type:
                                MarkerType.ArrowClosed,

                            color:
                                edgeColor,
                        },

                        label,

                        labelStyle: {
                            fill:
                                isWorkedWith
                                    ? "#67e8f9"
                                    : isWorksAt
                                        ? "#fcd34d"
                                        : isUses
                                            ? "#67e8f9"
                                            : active
                                                ? "#c4b5fd"
                                                : "#475569",

                            fontSize:
                                isWorkedWith ||
                                isWorksAt ||
                                isUses
                                    ? 9
                                    : 9,

                            fontWeight:
                                active
                                    ? 600
                                    : 400,
                        },

                        labelBgStyle: {
                            fill:
                                "#080c14",

                            fillOpacity:
                                0.95,
                        },

                        labelBgPadding: [
                            5,
                            3,
                        ],
                    };
                }
            );


        return {
            nodes: [
                ...developers,
                ...companies,
                ...skills,
            ],

            edges,
        };

    }, [
        graphData,
        selectedNode,
        connectionMap,
        search,
        searchMatches,
        getDynamicPosition,
    ]);


    /* =====================================================
       RESET
    ===================================================== */

    const resetGraph = () => {
        setSelectedNode(null);
        setSearch("");
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div
                className="
                    flex
                    min-h-[70vh]
                    items-center
                    justify-center
                "
            >
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="
                        flex
                        flex-col
                        items-center
                    "
                >
                    <div
                        className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-violet-500/20
                            bg-violet-500/10
                        "
                    >
                        <Network
                            size={24}
                            className="
                                animate-pulse
                                text-violet-400
                            "
                        />
                    </div>

                    <p
                        className="
                            mt-4
                            text-sm
                            font-medium
                            text-slate-400
                        "
                    >
                        Building skill graph...
                    </p>
                </motion.div>
            </div>
        );
    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {
        return (
            <div
                className="
                    flex
                    min-h-[70vh]
                    items-center
                    justify-center
                "
            >
                <div className="text-center">
                    <Network
                        size={30}
                        className="
                            mx-auto
                            text-red-400
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-sm
                            text-red-400
                        "
                    >
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadGraph}
                        className="
                            mt-4
                            rounded-xl
                            border
                            border-white/10
                            px-4
                            py-2
                            text-xs
                            text-slate-400
                            transition
                            hover:bg-white/5
                            hover:text-white
                        "
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }


    /* =====================================================
       MAIN UI
    ===================================================== */

    return (
        <div className="space-y-5">

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                "
            >
                <div>
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/")
                        }
                        className="
                            mb-3
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-slate-500
                            transition
                            hover:text-white
                        "
                    >
                        <ArrowLeft size={15} />
                        Dashboard
                    </button>

                    <div className="flex items-center gap-3">
                        <div
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-violet-500/10
                                text-violet-400
                            "
                        >
                            <Network size={21} />
                        </div>

                        <div>
                            <h1
                                className="
                                    text-2xl
                                    font-semibold
                                    text-white
                                "
                            >
                                Skill Graph
                            </h1>

                            <p
                                className="
                                    mt-1
                                    max-w-xl
                                    text-sm
                                    text-slate-500
                                "
                            >
                                Explore developers,
                                companies, technologies
                                and professional
                                relationships.
                            </p>
                        </div>
                    </div>
                </div>


                {/* SEARCH */}

                <div
                    className="
                        flex
                        w-full
                        gap-2
                        lg:w-auto
                    "
                >
                    <div
                        className="
                            relative
                            w-full
                            lg:w-80
                        "
                    >
                        <Search
                            size={17}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-600
                            "
                        />

                        <input
                            value={search}
                            onChange={(event) => {
                                setSearch(
                                    event.target.value
                                );

                                setSelectedNode(
                                    null
                                );
                            }}
                            placeholder="
                                Search developer,
                                company, skill...
                            "
                            className="
                                w-full
                                rounded-xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                py-2.5
                                pl-10
                                pr-10
                                text-sm
                                text-white
                                outline-none
                                placeholder:text-slate-600
                                transition
                                focus:border-violet-500/40
                                focus:bg-white/[0.05]
                            "
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-600
                                    transition
                                    hover:text-white
                                "
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    {search && (
                        <div
                            className="
                                hidden
                                items-center
                                rounded-xl
                                border
                                border-white/10
                                bg-white/[0.03]
                                px-3
                                text-[10px]
                                text-slate-500
                                sm:flex
                            "
                        >
                            {searchResultCount === 0
                                ? "No matches"
                                : `${searchResultCount} match${
                                      searchResultCount ===
                                      1
                                          ? ""
                                          : "es"
                                  }`}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={resetGraph}
                        title="Reset graph"
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            text-slate-500
                            transition
                            hover:bg-white/[0.06]
                            hover:text-white
                        "
                    >
                        <RotateCcw size={15} />
                    </button>
                </div>
            </div>


            {/* =================================================
                GRAPH
            ================================================= */}

            <div
                className="
                    relative
                    h-[calc(100vh-250px)]
                    min-h-[560px]
                    overflow-hidden
                    rounded-3xl
                    border
                    border-white/10
                    bg-[#080c14]
                "
            >

                {/* =================================================
                    STATS
                ================================================= */}

                <div
                    className="
                        pointer-events-none
                        absolute
                        left-5
                        top-5
                        z-20
                        flex
                        flex-wrap
                        gap-2
                    "
                >

                    {/* DEVELOPERS */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-white/10
                            bg-slate-950/90
                            px-3
                            py-2
                            text-xs
                            text-slate-400
                            shadow-xl
                            backdrop-blur-xl
                        "
                    >
                        <Users
                            size={14}
                            className="text-violet-400"
                        />

                        <span className="font-semibold text-white">
                            {developerCount}
                        </span>

                        developers
                    </div>


                    {/* COMPANIES */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-white/10
                            bg-slate-950/90
                            px-3
                            py-2
                            text-xs
                            text-slate-400
                            shadow-xl
                            backdrop-blur-xl
                        "
                    >
                        <Building2
                            size={14}
                            className="text-amber-400"
                        />

                        <span className="font-semibold text-white">
                            {companyCount}
                        </span>

                        companies
                    </div>


                    {/* TECHNOLOGIES */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-white/10
                            bg-slate-950/90
                            px-3
                            py-2
                            text-xs
                            text-slate-400
                            shadow-xl
                            backdrop-blur-xl
                        "
                    >
                        <Layers3
                            size={14}
                            className="text-cyan-400"
                        />

                        <span className="font-semibold text-white">
                            {skillCount}
                        </span>

                        technologies
                    </div>


                    {/* COLLABORATIONS */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-white/10
                            bg-slate-950/90
                            px-3
                            py-2
                            text-xs
                            text-slate-400
                            shadow-xl
                            backdrop-blur-xl
                        "
                    >
                        <BriefcaseBusiness
                            size={14}
                            className="text-cyan-400"
                        />

                        <span className="font-semibold text-white">
                            {developerConnectionCount}
                        </span>

                        collaborations
                    </div>
                </div>


                {/* =================================================
                    REACT FLOW
                ================================================= */}

                <SkillGraphFlow
                    nodes={flowData.nodes}
                    edges={flowData.edges}
                    nodeTypes={nodeTypes}
                    onPaneClick={() =>
                        setSelectedNode(null)
                    }
                />


                {/* =================================================
                    RELATIONSHIP INSPECTOR
                ================================================= */}

                <AnimatePresence>
                    {selectedNodeData && (
                        <motion.aside
                            initial={{
                                opacity: 0,
                                x: 30,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            exit={{
                                opacity: 0,
                                x: 30,
                            }}
                            transition={{
                                duration: 0.25,
                            }}
                            className="
                                absolute
                                right-4
                                top-4
                                z-30
                                flex
                                h-[calc(100%-32px)]
                                w-[350px]
                                max-w-[calc(100%-32px)]
                                flex-col
                                overflow-hidden
                                rounded-2xl
                                border
                                border-white/10
                                bg-[#080c14]/96
                                shadow-2xl
                                backdrop-blur-2xl
                            "
                        >

                            {/* =================================================
                                INSPECTOR HEADER
                            ================================================= */}

                            <div
                                className="
                                    shrink-0
                                    border-b
                                    border-white/10
                                    p-5
                                "
                            >
                                <div className="flex items-start justify-between">

                                    <div className="min-w-0">

                                        <div className="flex items-center gap-3">

                                            <div
                                                className={`
                                                    flex
                                                    h-11
                                                    w-11
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    text-sm
                                                    font-bold

                                                    ${
                                                        selectedNodeData.type ===
                                                        "developer"
                                                            ? "bg-violet-500/15 text-violet-300"
                                                            : selectedNodeData.type ===
                                                                "company"
                                                                ? "bg-amber-500/10 text-amber-400"
                                                                : "bg-cyan-500/10 text-cyan-400"
                                                    }
                                                `}
                                            >
                                                {selectedNodeData.type ===
                                                "developer" ? (
                                                    getInitials(
                                                        selectedNodeData.name
                                                    )
                                                ) : selectedNodeData.type ===
                                                  "company" ? (
                                                    <Building2
                                                        size={19}
                                                    />
                                                ) : (
                                                    <Code2
                                                        size={19}
                                                    />
                                                )}
                                            </div>


                                            <div className="min-w-0">

                                                <p
                                                    className="
                                                        max-w-[210px]
                                                        truncate
                                                        text-sm
                                                        font-semibold
                                                        text-white
                                                    "
                                                >
                                                    {
                                                        selectedNodeData.name
                                                    }
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        truncate
                                                        text-xs
                                                        text-slate-500
                                                    "
                                                >
                                                    {selectedNodeData.type ===
                                                    "developer"
                                                        ? selectedNodeData.role ||
                                                          "Developer"
                                                        : selectedNodeData.type ===
                                                            "company"
                                                            ? "Company"
                                                            : selectedNodeData.category ||
                                                              "Technology"}
                                                </p>

                                            </div>
                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedNode(
                                                null
                                            )
                                        }
                                        className="
                                            shrink-0
                                            rounded-lg
                                            p-1.5
                                            text-slate-600
                                            transition
                                            hover:bg-white/5
                                            hover:text-white
                                        "
                                    >
                                        <X size={16} />
                                    </button>

                                </div>


                                {/* DEVELOPER META */}

                                {selectedNodeData.type ===
                                    "developer" && (
                                    <div className="mt-4 space-y-2">

                                        {selectedNodeData.company && (
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >
                                                <Building2
                                                    size={13}
                                                    className="text-slate-600"
                                                />

                                                {
                                                    selectedNodeData.company
                                                }
                                            </div>
                                        )}


                                        {selectedNodeData.location && (
                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-xs
                                                    text-slate-500
                                                "
                                            >
                                                <MapPin
                                                    size={13}
                                                    className="text-slate-600"
                                                />

                                                {
                                                    selectedNodeData.location
                                                }
                                            </div>
                                        )}

                                    </div>
                                )}

                            </div>


                            {/* =================================================
                                INSPECTOR CONTENT
                            ================================================= */}

                            <div
                                className="
                                    min-h-0
                                    flex-1
                                    overflow-y-auto
                                    p-5
                                "
                            >

                                {/* =================================================
                                    DEVELOPER INSPECTOR
                                ================================================= */}

                                {selectedNodeData.type ===
                                "developer" ? (
                                    <>

                                        {/* SKILLS */}

                                        <div>

                                            <div
                                                className="
                                                    mb-3
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.15em]
                                                        text-slate-600
                                                    "
                                                >
                                                    Skills
                                                </p>

                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-violet-500/10
                                                        px-2
                                                        py-1
                                                        text-[10px]
                                                        text-violet-300
                                                    "
                                                >
                                                    {
                                                        selectedRelationships
                                                            .skills
                                                            .length
                                                    }
                                                </span>
                                            </div>


                                            <div className="space-y-2">

                                                {selectedRelationships
                                                    .skills
                                                    .length ===
                                                0 ? (
                                                    <p className="text-xs text-slate-600">
                                                        No skills
                                                        found.
                                                    </p>
                                                ) : (
                                                    selectedRelationships.skills.map(
                                                        (
                                                            skill
                                                        ) => (
                                                            <div
                                                                key={`${skill.id}-${skill.proficiency}`}
                                                                className="
                                                                    rounded-xl
                                                                    border
                                                                    border-white/5
                                                                    bg-white/[0.02]
                                                                    p-3
                                                                "
                                                            >

                                                                <div className="flex items-center justify-between gap-2">

                                                                    <div className="flex min-w-0 items-center gap-2">

                                                                        <Code2
                                                                            size={
                                                                                14
                                                                            }
                                                                            className="shrink-0 text-cyan-400"
                                                                        />

                                                                        <span
                                                                            className="
                                                                                truncate
                                                                                text-xs
                                                                                font-medium
                                                                                text-white
                                                                            "
                                                                        >
                                                                            {
                                                                                skill.name
                                                                            }
                                                                        </span>

                                                                    </div>


                                                                    <span
                                                                        className="
                                                                            shrink-0
                                                                            rounded-full
                                                                            bg-cyan-500/10
                                                                            px-2
                                                                            py-1
                                                                            text-[9px]
                                                                            text-cyan-300
                                                                        "
                                                                    >
                                                                        {
                                                                            skill.proficiency
                                                                        }
                                                                    </span>

                                                                </div>


                                                                {skill.category && (
                                                                    <p
                                                                        className="
                                                                            mt-1
                                                                            pl-5
                                                                            text-[9px]
                                                                            text-slate-600
                                                                        "
                                                                    >
                                                                        {
                                                                            skill.category
                                                                        }
                                                                    </p>
                                                                )}

                                                            </div>
                                                        )
                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* COMPANY */}

                                        <div className="mt-7">

                                            <div
                                                className="
                                                    mb-3
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.15em]
                                                        text-slate-600
                                                    "
                                                >
                                                    Company
                                                </p>

                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-amber-500/10
                                                        px-2
                                                        py-1
                                                        text-[10px]
                                                        text-amber-300
                                                    "
                                                >
                                                    {
                                                        selectedRelationships
                                                            .companies
                                                            .length
                                                    }
                                                </span>

                                            </div>


                                            <div className="space-y-2">

                                                {selectedRelationships
                                                    .companies
                                                    .length ===
                                                0 ? (
                                                    <p className="text-xs text-slate-600">
                                                        No company
                                                        found.
                                                    </p>
                                                ) : (
                                                    selectedRelationships.companies.map(
                                                        (
                                                            company
                                                        ) => (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    company.id
                                                                }
                                                                onClick={() =>
                                                                    setSelectedNode(
                                                                        company.id
                                                                    )
                                                                }
                                                                className="
                                                                    group
                                                                    w-full
                                                                    rounded-xl
                                                                    border
                                                                    border-white/5
                                                                    bg-white/[0.02]
                                                                    p-3
                                                                    text-left
                                                                    transition
                                                                    hover:border-amber-500/20
                                                                    hover:bg-amber-500/5
                                                                "
                                                            >

                                                                <div className="flex items-center justify-between gap-3">

                                                                    <div className="flex min-w-0 items-center gap-3">

                                                                        <div
                                                                            className="
                                                                                flex
                                                                                h-8
                                                                                w-8
                                                                                shrink-0
                                                                                items-center
                                                                                justify-center
                                                                                rounded-lg
                                                                                bg-amber-500/10
                                                                                text-amber-400
                                                                            "
                                                                        >
                                                                            <Building2
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        </div>


                                                                        <div className="min-w-0">

                                                                            <p className="truncate text-xs font-medium text-white">
                                                                                {
                                                                                    company.name
                                                                                }
                                                                            </p>

                                                                            <p className="mt-0.5 truncate text-[9px] text-slate-600">
                                                                                {
                                                                                    company.role ||
                                                                                    selectedNodeData.role ||
                                                                                    "Employee"
                                                                                }
                                                                            </p>

                                                                        </div>

                                                                    </div>


                                                                    <ChevronRight
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="
                                                                            shrink-0
                                                                            text-slate-700
                                                                            transition
                                                                            group-hover:text-amber-400
                                                                        "
                                                                    />

                                                                </div>

                                                            </button>
                                                        )
                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* COLLABORATIONS */}

                                        <div className="mt-7">

                                            <div
                                                className="
                                                    mb-3
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.15em]
                                                        text-slate-600
                                                    "
                                                >
                                                    Worked With
                                                </p>

                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-cyan-500/10
                                                        px-2
                                                        py-1
                                                        text-[10px]
                                                        text-cyan-300
                                                    "
                                                >
                                                    {
                                                        selectedRelationships
                                                            .developers
                                                            .length
                                                    }
                                                </span>
                                            </div>


                                            <div className="space-y-2">

                                                {selectedRelationships
                                                    .developers
                                                    .length ===
                                                0 ? (
                                                    <p className="text-xs text-slate-600">
                                                        No
                                                        collaborations
                                                        found.
                                                    </p>
                                                ) : (
                                                    selectedRelationships.developers.map(
                                                        (
                                                            developer
                                                        ) => (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    developer.id
                                                                }
                                                                onClick={() =>
                                                                    setSelectedNode(
                                                                        developer.id
                                                                    )
                                                                }
                                                                className="
                                                                    group
                                                                    w-full
                                                                    rounded-xl
                                                                    border
                                                                    border-white/5
                                                                    bg-white/[0.02]
                                                                    p-3
                                                                    text-left
                                                                    transition
                                                                    hover:border-cyan-500/20
                                                                    hover:bg-cyan-500/5
                                                                "
                                                            >

                                                                <div className="flex items-center justify-between gap-3">

                                                                    <div className="flex min-w-0 items-center gap-3">

                                                                        <div
                                                                            className="
                                                                                flex
                                                                                h-8
                                                                                w-8
                                                                                shrink-0
                                                                                items-center
                                                                                justify-center
                                                                                rounded-lg
                                                                                bg-violet-500/10
                                                                                text-[10px]
                                                                                font-bold
                                                                                text-violet-300
                                                                            "
                                                                        >
                                                                            {getInitials(
                                                                                developer.name
                                                                            )}
                                                                        </div>


                                                                        <div className="min-w-0">

                                                                            <p
                                                                                className="
                                                                                    truncate
                                                                                    text-xs
                                                                                    font-medium
                                                                                    text-white
                                                                                "
                                                                            >
                                                                                {
                                                                                    developer.name
                                                                                }
                                                                            </p>

                                                                            <p
                                                                                className="
                                                                                    mt-0.5
                                                                                    truncate
                                                                                    text-[9px]
                                                                                    text-slate-600
                                                                                "
                                                                            >
                                                                                {
                                                                                    developer.role ||
                                                                                    "Developer"
                                                                                }
                                                                            </p>

                                                                        </div>

                                                                    </div>


                                                                    <ChevronRight
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="
                                                                            shrink-0
                                                                            text-slate-700
                                                                            transition
                                                                            group-hover:text-cyan-400
                                                                        "
                                                                    />

                                                                </div>


                                                                {developer.project && (
                                                                    <div
                                                                        className="
                                                                            mt-3
                                                                            flex
                                                                            items-center
                                                                            gap-2
                                                                            border-t
                                                                            border-white/5
                                                                            pt-2
                                                                        "
                                                                    >
                                                                        <BriefcaseBusiness
                                                                            size={
                                                                                11
                                                                            }
                                                                            className="text-cyan-500"
                                                                        />

                                                                        <span
                                                                            className="
                                                                                truncate
                                                                                text-[9px]
                                                                                text-slate-500
                                                                            "
                                                                        >
                                                                            {
                                                                                developer.project
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}

                                                            </button>
                                                        )
                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* PROFILE */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/developers/${selectedNodeData.id}`
                                                )
                                            }
                                            className="
                                                mt-6
                                                flex
                                                w-full
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                bg-violet-600
                                                py-2.5
                                                text-xs
                                                font-medium
                                                text-white
                                                transition
                                                hover:bg-violet-500
                                            "
                                        >
                                            Open Developer Profile

                                            <ExternalLink
                                                size={13}
                                            />
                                        </button>

                                    </>

                                ) : selectedNodeData.type ===
                                  "company" ? (

                                    /* =================================================
                                       COMPANY INSPECTOR
                                    ================================================= */

                                    <>

                                        {/* DEVELOPERS */}

                                        <div>

                                            <div
                                                className="
                                                    mb-3
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.15em]
                                                        text-slate-600
                                                    "
                                                >
                                                    Developers
                                                </p>

                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-violet-500/10
                                                        px-2
                                                        py-1
                                                        text-[10px]
                                                        text-violet-300
                                                    "
                                                >
                                                    {
                                                        selectedRelationships
                                                            .developers
                                                            .length
                                                    }
                                                </span>
                                            </div>


                                            <div className="space-y-2">

                                                {selectedRelationships
                                                    .developers
                                                    .length ===
                                                0 ? (
                                                    <p className="text-xs text-slate-600">
                                                        No
                                                        developers
                                                        found.
                                                    </p>
                                                ) : (
                                                    selectedRelationships.developers.map(
                                                        (
                                                            developer
                                                        ) => (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    developer.id
                                                                }
                                                                onClick={() =>
                                                                    setSelectedNode(
                                                                        developer.id
                                                                    )
                                                                }
                                                                className="
                                                                    group
                                                                    w-full
                                                                    rounded-xl
                                                                    border
                                                                    border-white/5
                                                                    bg-white/[0.02]
                                                                    p-3
                                                                    text-left
                                                                    transition
                                                                    hover:border-violet-500/20
                                                                    hover:bg-violet-500/5
                                                                "
                                                            >

                                                                <div className="flex items-center justify-between gap-3">

                                                                    <div className="flex min-w-0 items-center gap-3">

                                                                        <div
                                                                            className="
                                                                                flex
                                                                                h-8
                                                                                w-8
                                                                                shrink-0
                                                                                items-center
                                                                                justify-center
                                                                                rounded-lg
                                                                                bg-violet-500/10
                                                                                text-[10px]
                                                                                font-bold
                                                                                text-violet-300
                                                                            "
                                                                        >
                                                                            {getInitials(
                                                                                developer.name
                                                                            )}
                                                                        </div>


                                                                        <div className="min-w-0">

                                                                            <p className="truncate text-xs font-medium text-white">
                                                                                {
                                                                                    developer.name
                                                                                }
                                                                            </p>

                                                                            <p className="mt-0.5 truncate text-[9px] text-slate-600">
                                                                                {
                                                                                    developer.role ||
                                                                                    "Developer"
                                                                                }
                                                                            </p>

                                                                        </div>

                                                                    </div>


                                                                    <ChevronRight
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="
                                                                            shrink-0
                                                                            text-slate-700
                                                                            transition
                                                                            group-hover:text-violet-400
                                                                        "
                                                                    />

                                                                </div>

                                                            </button>
                                                        )
                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* TECHNOLOGIES */}

                                        <div className="mt-7">

                                            <div
                                                className="
                                                    mb-3
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.15em]
                                                        text-slate-600
                                                    "
                                                >
                                                    Technologies
                                                </p>

                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-cyan-500/10
                                                        px-2
                                                        py-1
                                                        text-[10px]
                                                        text-cyan-300
                                                    "
                                                >
                                                    {
                                                        selectedRelationships
                                                            .skills
                                                            .length
                                                    }
                                                </span>
                                            </div>


                                            <div className="space-y-2">

                                                {selectedRelationships
                                                    .skills
                                                    .length ===
                                                0 ? (
                                                    <p className="text-xs text-slate-600">
                                                        No
                                                        technologies
                                                        found.
                                                    </p>
                                                ) : (
                                                    selectedRelationships.skills.map(
                                                        (
                                                            skill
                                                        ) => (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    skill.id
                                                                }
                                                                onClick={() =>
                                                                    setSelectedNode(
                                                                        skill.id
                                                                    )
                                                                }
                                                                className="
                                                                    group
                                                                    w-full
                                                                    rounded-xl
                                                                    border
                                                                    border-white/5
                                                                    bg-white/[0.02]
                                                                    p-3
                                                                    text-left
                                                                    transition
                                                                    hover:border-cyan-500/20
                                                                    hover:bg-cyan-500/5
                                                                "
                                                            >

                                                                <div className="flex items-center justify-between gap-3">

                                                                    <div className="flex min-w-0 items-center gap-3">

                                                                        <div
                                                                            className="
                                                                                flex
                                                                                h-8
                                                                                w-8
                                                                                shrink-0
                                                                                items-center
                                                                                justify-center
                                                                                rounded-lg
                                                                                bg-cyan-500/10
                                                                                text-cyan-400
                                                                            "
                                                                        >
                                                                            <Code2
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        </div>


                                                                        <div className="min-w-0">

                                                                            <p className="truncate text-xs font-medium text-white">
                                                                                {
                                                                                    skill.name
                                                                                }
                                                                            </p>

                                                                            <p className="mt-0.5 truncate text-[9px] text-slate-600">
                                                                                {
                                                                                    skill.category ||
                                                                                    "Technology"
                                                                                }
                                                                            </p>

                                                                        </div>

                                                                    </div>


                                                                    <ChevronRight
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="
                                                                            shrink-0
                                                                            text-slate-700
                                                                            transition
                                                                            group-hover:text-cyan-400
                                                                        "
                                                                    />

                                                                </div>

                                                            </button>
                                                        )
                                                    )
                                                )}

                                            </div>

                                        </div>

                                    </>

                                ) : (

                                    /* =================================================
                                       TECHNOLOGY INSPECTOR
                                    ================================================= */

                                    <>

                                        <div>

                                            <div
                                                className="
                                                    mb-3
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.15em]
                                                        text-slate-600
                                                    "
                                                >
                                                    Developers
                                                </p>

                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-violet-500/10
                                                        px-2
                                                        py-1
                                                        text-[10px]
                                                        text-violet-300
                                                    "
                                                >
                                                    {
                                                        selectedRelationships
                                                            .developers
                                                            .length
                                                    }
                                                </span>
                                            </div>


                                            <div className="space-y-2">

                                                {selectedRelationships
                                                    .developers
                                                    .length ===
                                                0 ? (
                                                    <p className="text-xs text-slate-600">
                                                        No
                                                        developers
                                                        found.
                                                    </p>
                                                ) : (
                                                    selectedRelationships.developers.map(
                                                        (
                                                            developer
                                                        ) => (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    developer.id
                                                                }
                                                                onClick={() =>
                                                                    setSelectedNode(
                                                                        developer.id
                                                                    )
                                                                }
                                                                className="
                                                                    group
                                                                    flex
                                                                    w-full
                                                                    items-center
                                                                    justify-between
                                                                    rounded-xl
                                                                    border
                                                                    border-white/5
                                                                    bg-white/[0.02]
                                                                    p-3
                                                                    text-left
                                                                    transition
                                                                    hover:border-violet-500/20
                                                                    hover:bg-violet-500/5
                                                                "
                                                            >

                                                                <div className="flex min-w-0 items-center gap-3">

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            h-8
                                                                            w-8
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-lg
                                                                            bg-violet-500/10
                                                                            text-[10px]
                                                                            font-bold
                                                                            text-violet-300
                                                                        "
                                                                    >
                                                                        {getInitials(
                                                                            developer.name
                                                                        )}
                                                                    </div>


                                                                    <div className="min-w-0">

                                                                        <p className="truncate text-xs font-medium text-white">
                                                                            {
                                                                                developer.name
                                                                            }
                                                                        </p>

                                                                        <p className="mt-1 truncate text-[9px] text-slate-600">
                                                                            {
                                                                                developer.role ||
                                                                                "Developer"
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>


                                                                <ChevronRight
                                                                    size={
                                                                        14
                                                                    }
                                                                    className="
                                                                        shrink-0
                                                                        text-slate-700
                                                                        transition
                                                                        group-hover:text-cyan-400
                                                                    "
                                                                />

                                                            </button>
                                                        )
                                                    )
                                                )}

                                            </div>

                                        </div>


                                        {/* COMPANIES */}

                                        <div className="mt-7">

                                            <div
                                                className="
                                                    mb-3
                                                    flex
                                                    items-center
                                                    justify-between
                                                "
                                            >
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.15em]
                                                        text-slate-600
                                                    "
                                                >
                                                    Companies
                                                </p>

                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-amber-500/10
                                                        px-2
                                                        py-1
                                                        text-[10px]
                                                        text-amber-300
                                                    "
                                                >
                                                    {
                                                        selectedRelationships
                                                            .companies
                                                            .length
                                                    }
                                                </span>
                                            </div>


                                            <div className="space-y-2">

                                                {selectedRelationships
                                                    .companies
                                                    .length ===
                                                0 ? (
                                                    <p className="text-xs text-slate-600">
                                                        No
                                                        companies
                                                        found.
                                                    </p>
                                                ) : (
                                                    selectedRelationships.companies.map(
                                                        (
                                                            company
                                                        ) => (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    company.id
                                                                }
                                                                onClick={() =>
                                                                    setSelectedNode(
                                                                        company.id
                                                                    )
                                                                }
                                                                className="
                                                                    group
                                                                    flex
                                                                    w-full
                                                                    items-center
                                                                    justify-between
                                                                    rounded-xl
                                                                    border
                                                                    border-white/5
                                                                    bg-white/[0.02]
                                                                    p-3
                                                                    text-left
                                                                    transition
                                                                    hover:border-amber-500/20
                                                                    hover:bg-amber-500/5
                                                                "
                                                            >

                                                                <div className="flex min-w-0 items-center gap-3">

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            h-8
                                                                            w-8
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-lg
                                                                            bg-amber-500/10
                                                                            text-amber-400
                                                                        "
                                                                    >
                                                                        <Building2
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </div>


                                                                    <div className="min-w-0">

                                                                        <p className="truncate text-xs font-medium text-white">
                                                                            {
                                                                                company.name
                                                                            }
                                                                        </p>

                                                                        <p className="mt-1 truncate text-[9px] text-slate-600">
                                                                            Company
                                                                        </p>

                                                                    </div>

                                                                </div>


                                                                <ChevronRight
                                                                    size={
                                                                        14
                                                                    }
                                                                    className="
                                                                        shrink-0
                                                                        text-slate-700
                                                                        transition
                                                                        group-hover:text-amber-400
                                                                    "
                                                                />

                                                            </button>
                                                        )
                                                    )
                                                )}

                                            </div>

                                        </div>

                                    </>
                                )}

                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>


                {/* =================================================
                    LEGEND
                ================================================= */}

                <div
                    className="
                        absolute
                        bottom-5
                        left-5
                        z-20
                        flex
                        max-w-[calc(100%-40px)]
                        flex-wrap
                        items-center
                        gap-4
                        rounded-xl
                        border
                        border-white/10
                        bg-slate-950/90
                        px-4
                        py-3
                        backdrop-blur-xl
                    "
                >

                    {/* DEVELOPER */}

                    <div className="flex items-center gap-2">
                        <span
                            className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-violet-500
                            "
                        />

                        <span className="text-xs text-slate-400">
                            Developer
                        </span>
                    </div>


                    {/* COMPANY */}

                    <div className="flex items-center gap-2">
                        <span
                            className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-amber-400
                            "
                        />

                        <span className="text-xs text-slate-400">
                            Company
                        </span>
                    </div>


                    {/* TECHNOLOGY */}

                    <div className="flex items-center gap-2">
                        <span
                            className="
                                h-2.5
                                w-2.5
                                rounded-full
                                bg-cyan-400
                            "
                        />

                        <span className="text-xs text-slate-400">
                            Technology
                        </span>
                    </div>


                    {/* WORKED TOGETHER */}

                    <div className="flex items-center gap-2">
                        <span
                            className="
                                h-px
                                w-6
                                border-t-2
                                border-dashed
                                border-cyan-400
                            "
                        />

                        <span className="text-xs text-slate-400">
                            Worked together
                        </span>
                    </div>


                    {/* WORKS AT */}

                    <div className="flex items-center gap-2">
                        <span
                            className="
                                h-px
                                w-6
                                border-t-2
                                border-dashed
                                border-amber-400
                            "
                        />

                        <span className="text-xs text-slate-400">
                            Works at
                        </span>
                    </div>


                    {/* USES */}

                    <div className="flex items-center gap-2">
                        <span
                            className="
                                h-px
                                w-6
                                border-t-2
                                border-dotted
                                border-cyan-300
                            "
                        />

                        <span className="text-xs text-slate-400">
                            Uses
                        </span>
                    </div>

                </div>

            </div>
        </div>
    );
}