from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.database import get_driver


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="Developer Skill Graph API",
    description="Developer intelligence platform powered by CognoDB",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://developer-skill-graph.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# API HEALTH
# =========================================================

@app.get("/api/health")
def health_check():
    return {
        "success": True,
        "message": "API is running",
    }


# =========================================================
# DATABASE HEALTH
# =========================================================

@app.get("/api/database/health")
def database_health_check():

    try:
        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                "RETURN 'CognoDB connection successful' AS message"
            )

            record = result.single()

            return {
                "success": True,
                "message": record["message"],
            }

    except Exception as error:

        return {
            "success": False,
            "message": "CognoDB connection failed",
            "error": str(error),
        }


# =========================================================
# GET ALL DEVELOPERS
# =========================================================

@app.get("/api/developers")
def get_all_developers():

    try:
        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                """
                MATCH (d:Developer)

                OPTIONAL MATCH
                    (d)-[w:WORKS_AT]->(c:Company)

                RETURN
                    d.id AS id,
                    d.name AS name,
                    d.location AS location,
                    d.experience AS experience,
                    w.role AS role,
                    c.name AS company

                ORDER BY d.name
                """
            )

            records = result.data()

            return {
                "developers": [
                    {
                        "id": record["id"],
                        "name": record["name"],
                        "location": record["location"],
                        "experience": record["experience"],
                        "role": record["role"],
                        "company": record["company"],
                    }
                    for record in records
                ]
            }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(error)}",
        )


# =========================================================
# GET DEVELOPER PROFILE
# =========================================================

@app.get("/api/developers/{developer_id}")
def get_developer_profile(developer_id: str):

    try:
        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                """
                MATCH
                    (d:Developer {id: $developer_id})

                OPTIONAL MATCH
                    (d)-[w:WORKS_AT]->(c:Company)

                OPTIONAL MATCH
                    (d)-[k:KNOWS]->(t:Technology)

                RETURN
                    d.id AS id,
                    d.name AS name,
                    d.email AS email,
                    d.experience AS experience,

                    w.role AS role,
                    c.name AS company,

                    collect(
                        DISTINCT {
                            name: t.name,
                            category: t.category,
                            proficiency: k.proficiency
                        }
                    ) AS skills
                """,
                developer_id=developer_id,
            )

            record = result.single()

            if not record:

                raise HTTPException(
                    status_code=404,
                    detail="Developer not found",
                )

            skills = [
                skill
                for skill in record["skills"]
                if skill["name"] is not None
            ]

            return {
                "id": record["id"],
                "name": record["name"],
                "email": record["email"],

                # Canonical property
                "experience": record["experience"],

                # Backward-compatible property
                "years_experience": record["experience"],

                "role": record["role"],
                "company": record["company"],
                "skills": skills,
            }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(error)}",
        )


# =========================================================
# GET DEVELOPER SKILLS
# =========================================================

@app.get("/api/developers/{developer_id}/skills")
def get_developer_skills(developer_id: str):

    try:
        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                """
                MATCH
                    (d:Developer {id: $developer_id})
                    -[r:KNOWS]->
                    (t:Technology)

                RETURN
                    d.name AS developer,
                    t.name AS technology,
                    t.category AS category,
                    r.proficiency AS proficiency

                ORDER BY t.name
                """,
                developer_id=developer_id,
            )

            records = result.data()

            if not records:

                raise HTTPException(
                    status_code=404,
                    detail="Developer not found or has no skills",
                )

            return {
                "developer": records[0]["developer"],
                "skills": [
                    {
                        "name": record["technology"],
                        "category": record["category"],
                        "proficiency": record["proficiency"],
                    }
                    for record in records
                ],
            }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(error)}",
        )


# =========================================================
# GET DEVELOPER CONNECTIONS
# =========================================================

@app.get("/api/developers/{developer_id}/connections")
def get_developer_connections(developer_id: str):

    try:
        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                """
                MATCH
                    (d:Developer {id: $developer_id})
                    -[w:WORKED_WITH]-
                    (colleague:Developer)

                OPTIONAL MATCH
                    (colleague)-[k:KNOWS]->(t:Technology)

                RETURN
                    d.name AS developer,

                    colleague.id AS colleague_id,
                    colleague.name AS colleague,

                    w.project AS project,

                    collect(
                        DISTINCT {
                            name: t.name,
                            category: t.category,
                            proficiency: k.proficiency
                        }
                    ) AS skills

                ORDER BY colleague.name
                """,
                developer_id=developer_id,
            )

            records = result.data()

            if not records:

                raise HTTPException(
                    status_code=404,
                    detail="Developer not found or has no connections",
                )

            return {
                "developer": records[0]["developer"],
                "connections": [
                    {
                        "id": record["colleague_id"],
                        "developer": record["colleague"],
                        "project": record["project"],
                        "skills": [
                            skill
                            for skill in record["skills"]
                            if skill["name"] is not None
                        ],
                    }
                    for record in records
                ],
            }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(error)}",
        )


# =========================================================
# FIND DEVELOPERS BY TECHNOLOGY
# =========================================================

@app.get("/api/technologies/{technology_name}/developers")
def get_developers_by_technology(technology_name: str):

    try:
        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                """
                MATCH
                    (d:Developer)
                    -[r:KNOWS]->
                    (t:Technology)

                WHERE
                    toLower(t.name) =
                    toLower($technology_name)

                RETURN
                    d.id AS developer_id,
                    d.name AS developer,

                    t.name AS technology,
                    t.category AS category,

                    r.proficiency AS proficiency

                ORDER BY d.name
                """,
                technology_name=technology_name,
            )

            records = result.data()

            if not records:

                raise HTTPException(
                    status_code=404,
                    detail=(
                        "Technology not found or "
                        "no developers have this skill"
                    ),
                )

            return {
                "technology": records[0]["technology"],
                "category": records[0]["category"],
                "developers": [
                    {
                        "id": record["developer_id"],
                        "name": record["developer"],
                        "proficiency": record["proficiency"],
                    }
                    for record in records
                ],
            }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(error)}",
        )


# =========================================================
# FIND SIMILAR DEVELOPERS
#
# IMPORTANT GRAPH QUERY
#
# Developer
#      ↓ KNOWS
#   Technology
#      ↑ KNOWS
# Developer
#
# This is a 2-hop graph traversal.
# =========================================================

@app.get("/api/developers/{developer_id}/similar")
def get_similar_developers(developer_id: str):

    try:
        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                """
                MATCH
                    (d:Developer {id: $developer_id})
                    -[:KNOWS]->
                    (t:Technology)
                    <-[:KNOWS]-
                    (other:Developer)

                WHERE
                    other.id <> d.id

                RETURN
                    other.id AS developer_id,
                    other.name AS developer,

                    collect(t.name) AS shared_skills,

                    count(t) AS matching_skills

                ORDER BY
                    matching_skills DESC,
                    developer
                """,
                developer_id=developer_id,
            )

            records = result.data()

            if not records:

                raise HTTPException(
                    status_code=404,
                    detail="No developers with shared skills found",
                )

            return {
                "developer": developer_id,
                "similar_developers": [
                    {
                        "id": record["developer_id"],
                        "name": record["developer"],
                        "shared_skills": record["shared_skills"],
                        "matching_skills": record["matching_skills"],
                    }
                    for record in records
                ],
            }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(error)}",
        )


# =========================================================
# COMPLETE GRAPH
#
# Developer
#      │
#      ├── KNOWS ──────────> Technology
#      │
#      ├── WORKS_AT ───────> Company
#      │
#      └── WORKED_WITH ────> Developer
#
# Company
#      │
#      └── USES ───────────> Technology
#
# Technology
#      │
#      └── RELATED_TO ─────> Technology
# =========================================================

@app.get("/api/graph")
def get_graph():

    try:
        driver = get_driver()

        nodes = {}
        edges = []
        edge_ids = set()

        with driver.session() as session:

            # =================================================
            # DEVELOPERS -> TECHNOLOGIES
            # DEVELOPERS -> COMPANIES
            # =================================================

            result = session.run(
                """
                MATCH (d:Developer)

                OPTIONAL MATCH
                    (d)-[k:KNOWS]->(t:Technology)

                OPTIONAL MATCH
                    (d)-[w:WORKS_AT]->(c:Company)

                RETURN
                    d.id AS developer_id,
                    d.name AS developer_name,
                    d.email AS developer_email,
                    d.experience AS developer_experience,
                    d.role AS developer_role,
                    d.location AS developer_location,

                    k.proficiency AS proficiency,

                    t.name AS technology_name,
                    t.category AS technology_category,

                    c.name AS company_name,
                    c.industry AS company_industry,
                    c.location AS company_location,

                    w.role AS company_role
                """
            )

            for record in result:

                developer_id = record["developer_id"]

                # -----------------------------------------
                # Developer node
                # -----------------------------------------

                if developer_id not in nodes:

                    nodes[developer_id] = {
                        "id": developer_id,
                        "type": "developer",
                        "label": record["developer_name"],
                        "name": record["developer_name"],
                        "email": record["developer_email"],
                        "experience": record[
                            "developer_experience"
                        ],
                        "role": record["developer_role"],
                        "location": record[
                            "developer_location"
                        ],
                    }

                # -----------------------------------------
                # Technology node
                # -----------------------------------------

                technology_name = record["technology_name"]

                if technology_name:

                    technology_id = (
                        f"technology-{technology_name}"
                    )

                    if technology_id not in nodes:

                        nodes[technology_id] = {
                            "id": technology_id,
                            "type": "skill",
                            "label": technology_name,
                            "name": technology_name,
                            "category": record[
                                "technology_category"
                            ],
                        }

                    # Developer -> Technology

                    edge_id = (
                        f"knows-"
                        f"{developer_id}-"
                        f"{technology_id}"
                    )

                    if edge_id not in edge_ids:

                        edges.append(
                            {
                                "id": edge_id,
                                "source": developer_id,
                                "target": technology_id,
                                "type": "KNOWS",
                                "proficiency": record[
                                    "proficiency"
                                ],
                            }
                        )

                        edge_ids.add(edge_id)

                # -----------------------------------------
                # Company node
                # -----------------------------------------

                company_name = record["company_name"]

                if company_name:

                    company_id = (
                        f"company-{company_name}"
                    )

                    if company_id not in nodes:

                        nodes[company_id] = {
                            "id": company_id,
                            "type": "company",
                            "label": company_name,
                            "name": company_name,
                            "industry": record[
                                "company_industry"
                            ],
                            "location": record[
                                "company_location"
                            ],
                        }

                    # Developer -> Company

                    edge_id = (
                        f"works-at-"
                        f"{developer_id}-"
                        f"{company_id}"
                    )

                    if edge_id not in edge_ids:

                        edges.append(
                            {
                                "id": edge_id,
                                "source": developer_id,
                                "target": company_id,
                                "type": "WORKS_AT",
                                "role": record[
                                    "company_role"
                                ],
                            }
                        )

                        edge_ids.add(edge_id)

                    # Company -> Technology

                    if technology_name:

                        technology_id = (
                            f"technology-{technology_name}"
                        )

                        edge_id = (
                            f"uses-"
                            f"{company_id}-"
                            f"{technology_id}"
                        )

                        if edge_id not in edge_ids:

                            edges.append(
                                {
                                    "id": edge_id,
                                    "source": company_id,
                                    "target": technology_id,
                                    "type": "USES",
                                }
                            )

                            edge_ids.add(edge_id)

            # =================================================
            # TECHNOLOGY -> TECHNOLOGY
            # =================================================

            related_result = session.run(
                """
                MATCH
                    (t1:Technology)
                    -[:RELATED_TO]-
                    (t2:Technology)

                RETURN
                    t1.name AS technology_1,
                    t1.category AS category_1,

                    t2.name AS technology_2,
                    t2.category AS category_2
                """
            )

            for record in related_result:

                technology_1 = record["technology_1"]
                technology_2 = record["technology_2"]

                node_1_id = (
                    f"technology-{technology_1}"
                )

                node_2_id = (
                    f"technology-{technology_2}"
                )

                if node_1_id not in nodes:

                    nodes[node_1_id] = {
                        "id": node_1_id,
                        "type": "skill",
                        "label": technology_1,
                        "name": technology_1,
                        "category": record[
                            "category_1"
                        ],
                    }

                if node_2_id not in nodes:

                    nodes[node_2_id] = {
                        "id": node_2_id,
                        "type": "skill",
                        "label": technology_2,
                        "name": technology_2,
                        "category": record[
                            "category_2"
                        ],
                    }

                pair = sorted(
                    [
                        node_1_id,
                        node_2_id,
                    ]
                )

                edge_id = (
                    f"related-"
                    f"{pair[0]}-"
                    f"{pair[1]}"
                )

                if edge_id not in edge_ids:

                    edges.append(
                        {
                            "id": edge_id,
                            "source": node_1_id,
                            "target": node_2_id,
                            "type": "RELATED_TO",
                        }
                    )

                    edge_ids.add(edge_id)

            # =================================================
            # DEVELOPER -> DEVELOPER
            # =================================================

            connection_result = session.run(
                """
                MATCH
                    (d1:Developer)
                    -[w:WORKED_WITH]-
                    (d2:Developer)

                RETURN
                    d1.id AS developer_1_id,
                    d1.name AS developer_1_name,
                    d1.role AS developer_1_role,
                    d1.location AS developer_1_location,

                    d2.id AS developer_2_id,
                    d2.name AS developer_2_name,
                    d2.role AS developer_2_role,
                    d2.location AS developer_2_location,

                    w.project AS project
                """
            )

            for record in connection_result:

                developer_1 = record["developer_1_id"]
                developer_2 = record["developer_2_id"]

                if developer_1 not in nodes:

                    nodes[developer_1] = {
                        "id": developer_1,
                        "type": "developer",
                        "label": record[
                            "developer_1_name"
                        ],
                        "name": record[
                            "developer_1_name"
                        ],
                        "role": record[
                            "developer_1_role"
                        ],
                        "location": record[
                            "developer_1_location"
                        ],
                    }

                if developer_2 not in nodes:

                    nodes[developer_2] = {
                        "id": developer_2,
                        "type": "developer",
                        "label": record[
                            "developer_2_name"
                        ],
                        "name": record[
                            "developer_2_name"
                        ],
                        "role": record[
                            "developer_2_role"
                        ],
                        "location": record[
                            "developer_2_location"
                        ],
                    }

                pair = sorted(
                    [
                        developer_1,
                        developer_2,
                    ]
                )

                edge_id = (
                    f"connection-"
                    f"{pair[0]}-"
                    f"{pair[1]}"
                )

                if edge_id not in edge_ids:

                    edges.append(
                        {
                            "id": edge_id,
                            "source": developer_1,
                            "target": developer_2,
                            "type": "WORKED_WITH",
                            "project": record["project"],
                        }
                    )

                    edge_ids.add(edge_id)

        return {
            "nodes": list(nodes.values()),
            "edges": edges,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Database error: {str(error)}",
        )


# =========================================================
# GLOBAL SEARCH
# =========================================================

@app.get("/api/search")
def global_search(q: str):

    query = q.strip()

    if not query:

        return {
            "query": "",
            "developers": [],
            "skills": [],
            "companies": [],
        }

    try:

        driver = get_driver()

        with driver.session() as session:

            # =================================================
            # SEARCH DEVELOPERS
            # =================================================

            developer_result = session.run(
                """
                MATCH (d:Developer)

                OPTIONAL MATCH
                    (d)-[:WORKS_AT]->(c:Company)

                WHERE
                    toLower(coalesce(d.name, "")) CONTAINS
                    toLower($query)

                    OR

                    toLower(coalesce(d.email, "")) CONTAINS
                    toLower($query)

                    OR

                    toLower(coalesce(d.role, "")) CONTAINS
                    toLower($query)

                    OR

                    toLower(coalesce(d.location, "")) CONTAINS
                    toLower($query)

                    OR

                    toLower(coalesce(c.name, "")) CONTAINS
                    toLower($query)

                RETURN DISTINCT
                    d.id AS id,
                    d.name AS name,
                    d.role AS role,
                    d.location AS location,
                    c.name AS company

                ORDER BY d.name

                LIMIT 8
                """,
                query=query,
            )

            developers = [
                {
                    "id": record["id"],
                    "name": record["name"],
                    "role": record["role"],
                    "location": record["location"],
                    "company": record["company"],
                }
                for record in developer_result
            ]

            # =================================================
            # SEARCH TECHNOLOGIES
            # =================================================

            skill_result = session.run(
                """
                MATCH (t:Technology)

                WHERE
                    toLower(coalesce(t.name, "")) CONTAINS
                    toLower($query)

                    OR

                    toLower(coalesce(t.category, "")) CONTAINS
                    toLower($query)

                RETURN DISTINCT
                    t.name AS name,
                    t.category AS category

                ORDER BY t.name

                LIMIT 8
                """,
                query=query,
            )

            skills = [
                {
                    "name": record["name"],
                    "category": record["category"],
                }
                for record in skill_result
            ]

            # =================================================
            # SEARCH COMPANIES
            # =================================================

            company_result = session.run(
                """
                MATCH (c:Company)

                WHERE
                    toLower(coalesce(c.name, "")) CONTAINS
                    toLower($query)

                RETURN DISTINCT
                    c.name AS name

                ORDER BY c.name

                LIMIT 8
                """,
                query=query,
            )

            companies = [
                {
                    "name": record["name"],
                }
                for record in company_result
            ]

            return {
                "query": query,
                "developers": developers,
                "skills": skills,
                "companies": companies,
            }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Search error: {str(error)}",
        )