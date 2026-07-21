# CLAUDE.md

# RisetIn

AI-powered Innovation Marketplace that bridges student research with industry needs.

---

# Project Overview

RisetIn is a B2B innovation marketplace designed to solve the "Valley of Death" problem in Indonesian research commercialization.

Many university research projects, PKM, PIMNAS, and student innovations never reach the industry because there is no continuous marketplace connecting researchers and companies.

RisetIn enables industries to discover innovations using AI while allowing students to commercialize their research safely.

The platform is NOT another repository.

It is an innovation marketplace.

---

# Main Users

## Student / Researcher

Can:

- Register & Verify Student Identity
- Upload Research
- Save Draft
- Publish Research
- Receive Collaboration Requests
- Chat with Industry
- Monitor Project Progress
- Manage Portfolio
- View AI Quality Score
- View Research Analytics

---

## Industry

Can:

- Register & Verify Company
- Search Research
- AI Matchmaking
- Send Collaboration Requests
- Chat with Researchers
- Track Collaboration
- Bookmark Research
- View Research Details

---

# Core Problems

Current problems:

- Student research stops after competitions
- Difficult for industry to discover innovations
- Existing government platforms are seasonal
- Collaboration process is complicated
- No secure communication before collaboration

RisetIn solves these with:

- AI Matchmaking
- Research Marketplace
- Digital NDA
- Collaboration Workspace
- Research Quality Scoring

---

# Main Features

## Authentication

- Login
- Register
- Email Verification
- Forgot Password

Role-based authentication.

---

## Student Dashboard

Modules:

- Overview
- Upload Research
- Draft
- Published Research
- Collaboration
- Messages
- Notifications
- Analytics
- Profile

---

## Industry Dashboard

Modules:

- Dashboard
- AI Matchmaking
- Marketplace
- Collaboration
- Messages
- Saved Research
- Notifications
- Company Profile

---

## Research Marketplace

Research Card contains:

- Cover Image
- Title
- Abstract
- Category
- Research Stage
- License
- Author
- University
- Tags
- AI Score

Filter:

- Latest
- Popular
- Nearby
- Category
- Research Readiness
- Technology

---

## AI Matchmaking

Industry enters business problems.

Example:

"Our company needs a water management solution for agriculture."

AI returns:

- Matching researches
- Match percentage
- Why it matches
- Suggested collaboration

---

## AI Research Quality Score

After upload:

AI automatically evaluates:

- Abstract quality
- Innovation level
- Market potential
- Readability
- Commercial readiness

Returns score:

0 - 100

with recommendations.

---

## Collaboration Workspace

Contains:

Timeline

- Initiation
- Negotiation
- Development
- Implementation
- Commercialization

Features:

- Chat
- File Sharing
- Milestones
- Activity Log
- Meeting Notes

---

## Notification System

Examples:

Research Published

Industry Interested

Collaboration Accepted

New Chat

Project Updated

Milestone Completed

NDA Signed

AI Analysis Completed

---

## Profile

Student

- KTM Verification
- Skills
- Research Portfolio
- Published Research
- Collaboration History

Industry

- NIB Verification
- NPWP Verification
- Company Information
- Collaboration History

---

# Future Features

Not for MVP.

- Digital NDA
- Patent Recommendation
- Funding Marketplace
- Investor Matching
- Research Grant Recommendation
- API Integration with PDDikti
- BRIN Integration

---

# MVP Scope

Focus ONLY on these features.

Authentication

Student Dashboard

Industry Dashboard

Upload Research

Marketplace

AI Matchmaking (Mock)

Collaboration Request

Chat

Notification

Profile

No payment system.

No mobile app.

Responsive website only.

---

# Tech Stack

Frontend

- Next.js 15
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Lucide Icons

Backend

- Supabase

Use:

- Auth
- Database
- Storage
- Realtime
- Edge Functions

AI

OpenAI API

Future:

- Embedding Search
- RAG
- Semantic Search

---

# Database Tables

profiles

research

research_files

research_tags

categories

industries

companies

collaboration_requests

collaborations

messages

notifications

bookmarks

research_scores

verification_documents

---

# Design Style

Modern SaaS

Clean

Minimal

Professional

Soft Purple

Primary Color

#5B3DF5

Accent

#8B5CF6

Background

#FAFAFC

Rounded

Large Border Radius

Cards

Soft Shadow

Spacing

Comfortable

---

# UI Inspiration

Linear

Notion

GitHub

Stripe Dashboard

Vercel

Medium

Dribbble SaaS

---

# UX Principles

- Mobile First
- Accessibility
- Minimal Clicks
- Clear Navigation
- Fast Interaction
- Consistent Components

---

# Folder Structure

app/

components/

features/

hooks/

lib/

services/

types/

utils/

styles/

public/

---

# Coding Rules

Always use:

TypeScript

Reusable Components

Server Components when possible

Client Components only if needed

Clean architecture

Avoid duplicated code.

Use custom hooks.

Strong typing.

No inline styles.

Tailwind only.

---

# Component Naming

PascalCase

Example

ResearchCard.tsx

UploadResearchDialog.tsx

AIRecommendationCard.tsx

IndustrySidebar.tsx

---

# Commit Convention

feat:

fix:

refactor:

style:

docs:

test:

chore:

---

# Priority Order

Phase 1

Authentication

Phase 2

Dashboard

Phase 3

Upload Research

Phase 4

Marketplace

Phase 5

AI Matchmaking

Phase 6

Collaboration

Phase 7

Chat

Phase 8

Notifications

Phase 9

Polishing

---

# Important Notes

Always prioritize clean UX over feature quantity.

The application should feel like a professional SaaS platform.

Never generate unnecessary pages.

Prefer reusable layouts and components.

Keep the code scalable for future AI features.

Every feature should be modular.

Always think as if this project will eventually become a national-scale innovation marketplace.