# Developer Skill Graph

A graph-powered developer intelligence platform for exploring developers, technologies, companies, skills, and professional relationships.

The application uses **CognoDB** as the graph database and provides an interactive web interface for discovering developer skills and navigating relationships within the developer ecosystem.

---

## Overview

Developer Skill Graph models a developer ecosystem as a connected graph rather than a collection of isolated records.

The application connects:

- Developers
- Technologies / Skills
- Companies
- Developer collaborations
- Company technology usage
- Related technologies

This allows users to explore not only individual developer profiles, but also the relationships between people, technologies, and organizations.

### Live Application

**[Open Developer Skill Graph](https://developer-skill-graph.vercel.app/)**

---

## Problem Statement

Developer information is naturally relationship-heavy.

A developer can have multiple skills, work for a company, collaborate with other developers, and share technologies with other developers. Companies also use multiple technologies, while technologies can be related to one another.

Representing these connections using only traditional tabular structures can require multiple joins and complex relationship queries.

The goal of this project is to provide an intuitive way to explore this connected developer ecosystem using a graph database.

---

## Solution

Developer Skill Graph represents the developer ecosystem as a graph using **CognoDB**.

The application provides:

- Developer discovery
- Developer profiles
- Skill and technology exploration
- Skill proficiency information
- Developer-to-developer relationships
- Company relationships
- Similar developer discovery
- Technology-based developer discovery
- Interactive graph visualization
- Graph-based relationship exploration

The frontend communicates with a FastAPI backend, which queries CognoDB using Cypher through the Neo4j Python driver.

---

## Why a Graph Database?

The core problem is relationship-oriented.

The important questions are not only:

> "What skills does this developer have?"

but also:

- Which developers share similar skills?
- Which developers have worked together?
- Which technologies are used by a company?
- Which developers know a particular technology?
- Which technologies are related?
- How are developers, companies, and technologies connected?

These relationships can be naturally represented as a graph.

For example, similar developers can be discovered through the traversal:

```text
Developer
    ↓ KNOWS
Technology
    ↑ KNOWS
Developer