import os

from dotenv import load_dotenv
from neo4j import GraphDatabase


load_dotenv()

COGNODB_URI = os.getenv("COGNODB_URI")
COGNODB_USERNAME = os.getenv("COGNODB_USERNAME")
COGNODB_PASSWORD = os.getenv("COGNODB_PASSWORD")


print("URI:", COGNODB_URI)
print("USERNAME:", COGNODB_USERNAME)
print("PASSWORD SET:", bool(COGNODB_PASSWORD))


driver = GraphDatabase.driver(
    COGNODB_URI,
    auth=(COGNODB_USERNAME, COGNODB_PASSWORD),
)


def get_driver():
    return driver