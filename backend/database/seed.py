import os

from dotenv import load_dotenv
from neo4j import GraphDatabase


# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

load_dotenv()


COGNODB_URI = os.getenv("COGNODB_URI")
COGNODB_USERNAME = os.getenv("COGNODB_USERNAME")
COGNODB_PASSWORD = os.getenv("COGNODB_PASSWORD")


# --------------------------------------------------
# Sample data
# --------------------------------------------------

developers = [
    {
        "id": "dev-001",
        "name": "Aarav Sharma",
        "experience": 4,
        "location": "Bangalore",
    },
    {
        "id": "dev-002",
        "name": "Priya Mehta",
        "experience": 3,
        "location": "Mumbai",
    },
    {
        "id": "dev-003",
        "name": "Rohan Verma",
        "experience": 5,
        "location": "Hyderabad",
    },
    {
        "id": "dev-004",
        "name": "Ananya Singh",
        "experience": 2,
        "location": "Delhi",
    },
    {
        "id": "dev-005",
        "name": "Kabir Patel",
        "experience": 6,
        "location": "Pune",
    },
    {
        "id": "dev-006",
        "name": "Neha Gupta",
        "experience": 3,
        "location": "Bangalore",
    },
    {
        "id": "dev-007",
        "name": "Arjun Rao",
        "experience": 7,
        "location": "Chennai",
    },
    {
        "id": "dev-008",
        "name": "Ishita Jain",
        "experience": 4,
        "location": "Hyderabad",
    },
]


technologies = [
    {
        "id": "tech-001",
        "name": "Python",
        "category": "Backend",
    },
    {
        "id": "tech-002",
        "name": "FastAPI",
        "category": "Backend",
    },
    {
        "id": "tech-003",
        "name": "Java",
        "category": "Backend",
    },
    {
        "id": "tech-004",
        "name": "Spring Boot",
        "category": "Backend",
    },
    {
        "id": "tech-005",
        "name": "React",
        "category": "Frontend",
    },
    {
        "id": "tech-006",
        "name": "JavaScript",
        "category": "Frontend",
    },
    {
        "id": "tech-007",
        "name": "PostgreSQL",
        "category": "Database",
    },
    {
        "id": "tech-008",
        "name": "Docker",
        "category": "DevOps",
    },
    {
        "id": "tech-009",
        "name": "AWS",
        "category": "Cloud",
    },
    {
        "id": "tech-010",
        "name": "Redis",
        "category": "Database",
    },
]


companies = [
    {
        "id": "company-001",
        "name": "TechNova",
        "industry": "Software",
        "location": "Bangalore",
    },
    {
        "id": "company-002",
        "name": "CloudSphere",
        "industry": "Cloud Computing",
        "location": "Hyderabad",
    },
    {
        "id": "company-003",
        "name": "FinEdge",
        "industry": "FinTech",
        "location": "Mumbai",
    },
    {
        "id": "company-004",
        "name": "DataForge",
        "industry": "Data Engineering",
        "location": "Pune",
    },
]


# --------------------------------------------------
# Create database driver
# --------------------------------------------------

driver = GraphDatabase.driver(
    COGNODB_URI,
    auth=(COGNODB_USERNAME, COGNODB_PASSWORD),
)


# --------------------------------------------------
# Seed function
# --------------------------------------------------

def seed_database():
    with driver.session() as session:

        # ------------------------------------------
        # Create Developers
        # ------------------------------------------

        for developer in developers:

            session.run(
                """
                MERGE (d:Developer {id: $id})
                SET d.name = $name,
                    d.experience = $experience,
                    d.location = $location
                """,
                **developer,
            )

        # ------------------------------------------
        # Create Technologies
        # ------------------------------------------

        for technology in technologies:

            session.run(
                """
                MERGE (t:Technology {id: $id})
                SET t.name = $name,
                    t.category = $category
                """,
                **technology,
            )

        # ------------------------------------------
        # Create Companies
        # ------------------------------------------

        for company in companies:

            session.run(
                """
                MERGE (c:Company {id: $id})
                SET c.name = $name,
                    c.industry = $industry,
                    c.location = $location
                """,
                **company,
            )

        # ------------------------------------------
        # Developer -> Technology relationships
        # ------------------------------------------

        developer_skills = [
            ("dev-001", "tech-001", "Advanced"),
            ("dev-001", "tech-002", "Advanced"),
            ("dev-001", "tech-007", "Intermediate"),
            ("dev-001", "tech-008", "Intermediate"),

            ("dev-002", "tech-005", "Advanced"),
            ("dev-002", "tech-006", "Advanced"),
            ("dev-002", "tech-001", "Intermediate"),

            ("dev-003", "tech-003", "Advanced"),
            ("dev-003", "tech-004", "Advanced"),
            ("dev-003", "tech-007", "Advanced"),
            ("dev-003", "tech-009", "Intermediate"),

            ("dev-004", "tech-005", "Intermediate"),
            ("dev-004", "tech-006", "Advanced"),
            ("dev-004", "tech-010", "Intermediate"),

            ("dev-005", "tech-003", "Advanced"),
            ("dev-005", "tech-004", "Advanced"),
            ("dev-005", "tech-008", "Advanced"),
            ("dev-005", "tech-009", "Advanced"),

            ("dev-006", "tech-001", "Advanced"),
            ("dev-006", "tech-002", "Intermediate"),
            ("dev-006", "tech-010", "Advanced"),

            ("dev-007", "tech-003", "Advanced"),
            ("dev-007", "tech-009", "Advanced"),
            ("dev-007", "tech-008", "Advanced"),

            ("dev-008", "tech-001", "Advanced"),
            ("dev-008", "tech-005", "Intermediate"),
            ("dev-008", "tech-007", "Advanced"),
        ]

        for developer_id, technology_id, proficiency in developer_skills:

            session.run(
                """
                MATCH (d:Developer {id: $developer_id})
                MATCH (t:Technology {id: $technology_id})

                MERGE (d)-[r:KNOWS]->(t)

                SET r.proficiency = $proficiency
                """,
                developer_id=developer_id,
                technology_id=technology_id,
                proficiency=proficiency,
            )

        # ------------------------------------------
        # Developer -> Company relationships
        # ------------------------------------------

        employment = [
            ("dev-001", "company-001", "Backend Engineer"),
            ("dev-002", "company-001", "Frontend Engineer"),
            ("dev-003", "company-002", "Senior Backend Engineer"),
            ("dev-004", "company-003", "Frontend Developer"),
            ("dev-005", "company-004", "Platform Engineer"),
            ("dev-006", "company-002", "Python Developer"),
            ("dev-007", "company-002", "Cloud Engineer"),
            ("dev-008", "company-004", "Data Engineer"),
        ]

        for developer_id, company_id, role in employment:

            session.run(
                """
                MATCH (d:Developer {id: $developer_id})
                MATCH (c:Company {id: $company_id})

                MERGE (d)-[r:WORKS_AT]->(c)

                SET r.role = $role
                """,
                developer_id=developer_id,
                company_id=company_id,
                role=role,
            )

        # ------------------------------------------
        # Company -> Technology relationships
        # ------------------------------------------

        company_technologies = [
            ("company-001", "tech-001"),
            ("company-001", "tech-002"),
            ("company-001", "tech-005"),
            ("company-001", "tech-006"),

            ("company-002", "tech-001"),
            ("company-002", "tech-003"),
            ("company-002", "tech-008"),
            ("company-002", "tech-009"),

            ("company-003", "tech-003"),
            ("company-003", "tech-004"),
            ("company-003", "tech-007"),
            ("company-003", "tech-010"),

            ("company-004", "tech-001"),
            ("company-004", "tech-007"),
            ("company-004", "tech-008"),
        ]

        for company_id, technology_id in company_technologies:

            session.run(
                """
                MATCH (c:Company {id: $company_id})
                MATCH (t:Technology {id: $technology_id})

                MERGE (c)-[:USES]->(t)
                """,
                company_id=company_id,
                technology_id=technology_id,
            )

        # ------------------------------------------
        # Technology -> Technology relationships
        # ------------------------------------------

        related_technologies = [
            ("tech-001", "tech-002"),
            ("tech-003", "tech-004"),
            ("tech-005", "tech-006"),
            ("tech-001", "tech-008"),
            ("tech-008", "tech-009"),
            ("tech-007", "tech-010"),
        ]

        for technology_a, technology_b in related_technologies:

            session.run(
                """
                MATCH (a:Technology {id: $technology_a})
                MATCH (b:Technology {id: $technology_b})

                MERGE (a)-[:RELATED_TO]->(b)
                """,
                technology_a=technology_a,
                technology_b=technology_b,
            )

        # ------------------------------------------
        # Developer -> Developer relationships
        # ------------------------------------------

        collaborations = [
            ("dev-001", "dev-002", "Web Platform"),
            ("dev-001", "dev-006", "Developer Tools"),
            ("dev-002", "dev-004", "Customer Portal"),
            ("dev-003", "dev-005", "Cloud Migration"),
            ("dev-003", "dev-007", "Cloud Infrastructure"),
            ("dev-005", "dev-008", "Data Platform"),
            ("dev-006", "dev-008", "Analytics Platform"),
        ]

        for developer_a, developer_b, project in collaborations:

            session.run(
                """
                MATCH (a:Developer {id: $developer_a})
                MATCH (b:Developer {id: $developer_b})

                MERGE (a)-[r:WORKED_WITH]->(b)

                SET r.project = $project
                """,
                developer_a=developer_a,
                developer_b=developer_b,
                project=project,
            )

    print("Database seeding completed successfully!")


# --------------------------------------------------
# Run the seed
# --------------------------------------------------

try:

    print("Connecting to CognoDB...")

    driver.verify_connectivity()

    print("Connection successful.")
    print("Seeding database...")

    seed_database()

finally:

    driver.close()