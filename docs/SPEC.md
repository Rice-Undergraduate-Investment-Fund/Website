# Rice Undergraduate Investment Fund (RUIF) Website Rebuild Specification

## 1. Project Objective

Rebuild the current Rice Finance / Rice Undergraduate Investment Fund
website (`financegroup.rice.edu`) from scratch as a modern, maintainable
website.

The new site should solve the main limitations of the current Wix
implementation:

-   Improve visual quality, consistency, and responsiveness.
-   Make fundamental design changes easy during development.
-   Keep the website maintainable after the original developers
    graduate.
-   Allow routine semester/yearly content changes without editing code.
-   Keep the source code under institutional rather than individual
    ownership.
-   Make technical handoff to a new student owner straightforward.
-   Preserve the ability to make larger future changes through a normal
    Git-based development workflow and AI coding tools.

The website should be designed so that **most future officers interact
with a CMS, not the codebase**.

------------------------------------------------------------------------

## 2. Technical Architecture

### 2.1 Core Stack

  -------------------------------------------------------------------------
  Layer                   Recommended Technology    Purpose
  ----------------------- ------------------------- -----------------------
  Frontend                Next.js                   Website application and
                                                    routing

  Language                TypeScript                Maintainable, strongly
                                                    typed code

  Styling                 Tailwind CSS              Responsive styling and
                                                    design system

  Source Control          GitHub Organization       Institutional ownership
                                                    of the codebase

  CMS                     Sanity                    Editable club content

  Hosting / Deployment    Vercel                    Builds and hosts the
                                                    public website

  Domain                  `financegroup.rice.edu`   Existing public-facing
                                                    domain

  Analytics               Vercel Analytics and/or   Optional traffic
                          Google Analytics          analytics

  Development             AI-assisted IDE/agent     Help future maintainers
                                                    modify the codebase
  -------------------------------------------------------------------------

A database such as Supabase is **not required initially**. It should
only be introduced if the website later needs features such as member
authentication, protected resources, attendance tracking, voting, or
other persistent application data.

### 2.2 How the Stack Works

GitHub and Sanity are two separate inputs to the public website.

``` text
                    WEBSITE CODE
                         │
                         ▼
                GitHub Organization
                         │
                         │ automatic deployment
                         ▼
                      Vercel
                  builds + hosts
                         │
                         ▼
                financegroup.rice.edu
                         ▲
                         │ fetches content
                         │
                      Sanity CMS
                         ▲
                         │
                 RUIF officers edit
                    content here
```

### 2.3 GitHub --- Code and Design

GitHub stores the website itself:

-   Page structure
-   Navigation
-   Components
-   Typography
-   Colors
-   Layout
-   Animations
-   Mobile responsiveness
-   CMS integration
-   Business logic

The repository should belong to a **RUIF/Rice Finance GitHub
Organization**, rather than an individual student's GitHub account.

Future maintainers should only need to work in GitHub when changing the
website's design, structure, or functionality.

### 2.4 Sanity --- Editable Content

Sanity stores information that changes over time, including:

-   Current board
-   Sector directors
-   Sector members
-   Member photographs
-   Alumni
-   Portfolio statistics
-   Holdings
-   Training Program dates
-   Application links
-   Contact information
-   Semester-specific information
-   Site settings

Routine updates should therefore not require a Git commit.

For example, replacing a graduating Sector Director should involve
changing the relevant person in Sanity and publishing the change---not
modifying a React component.

### 2.5 Vercel --- Hosting and Deployment

Vercel hosts the actual public website.

The intended development workflow is:

``` text
Code change
    ↓
Git commit / pull request
    ↓
GitHub
    ↓
Vercel preview deployment
    ↓
Review
    ↓
Merge to main
    ↓
Automatic production deployment
```

This removes the need for future students to maintain a traditional
server, operating system, nginx configuration, deployment scripts, etc.

### 2.6 Annual Handoff Model

The club should institutionally control:

1.  GitHub Organization
2.  Sanity organization/project
3.  Vercel team/project
4.  Domain/DNS access, where applicable

At each leadership transition, access can be transferred to the incoming
officers.

The handoff rule should be:

> **Content change → Sanity**\
> **Design/functionality change → GitHub → Vercel**

A future webmaster should be able to maintain normal club information
without knowing TypeScript or Next.js.

------------------------------------------------------------------------

## 3. Content Architecture

### 3.1 Person Model

Avoid maintaining separate copies of the same individual for Board,
Sectors, and Alumni.

Use one central `Person` content type.

Suggested fields:

``` text
Person

Name
Photo
Email
LinkedIn
Graduation Year
Bio

Current Member?       Yes / No
Board Member?         Yes / No
Alumni?               Yes / No

Board Position
Sector
Sector Director?      Yes / No

Employer
Job Title
Location

Display Order
```

The website can then determine where the person appears.

Example:

``` text
Board Member = Yes
        ↓
Appears on /board

Sector = Technology
        ↓
Appears within Technology sector

Alumni = Yes
        ↓
Appears on /alumni
```

This reduces duplicate data and makes annual transitions easier.

### 3.2 Sector Model

Suggested fields:

``` text
Sector

Name
Slug
Description
Sector Director → Person
Members → Person[]
Display Order
Current Holdings (optional)
```

### 3.3 Other CMS Models

Additional content types should include:

-   Alumni information, primarily through the Person model
-   Portfolio statistics
-   Portfolio allocations
-   Holdings
-   Training Program sessions
-   Recruitment/application information
-   Contact details
-   Site-wide settings

------------------------------------------------------------------------

# 4. Visual Identity

The website should use the established **Rice University / RUIF color
identity**.

Primary visual palette:

-   **Rice Blue** --- primary brand color
-   **White** --- primary background / contrast color
-   **Black** --- supporting text or visual accent where necessary

The site should generally feel:

-   Professional
-   Institutional
-   Finance-oriented
-   Modern
-   Clean
-   Spacious
-   Consistent

Avoid unnecessary decorative elements or excessive colors.

Photography should be given substantial visual importance, particularly
on the About, Sector, Board, and Alumni pages.

The final implementation should use the official Rice University brand
color values rather than visually approximating Rice Blue.

------------------------------------------------------------------------

# 5. Site Navigation

Proposed primary navigation:

``` text
RICE FINANCE / RUIF

About
Sectors
Portfolio
Training Program
People
    ├── Board
    └── Alumni
Contact
```

An **Apply** button can appear prominently in the navigation when
applications are open.

------------------------------------------------------------------------

# 6. Page Designs

## 6.1 About Page

### Purpose

Introduce RUIF, explain the organization's mission, establish
credibility, and quickly explain how the fund operates.

### Draft Layout

``` text
ABOUT RICE FINANCE
────────────────────────────────────

[Hero photograph]

Rice University's Student-Run
Investment Fund

[Short introductory description]


OUR MISSION

Practical        Hands-On        Collaborative
Goal-Oriented    Investing       Decision-Making


THE FUND

140+                  11                   $XX
Members               Sectors              AUM


HOW WE OPERATE

Training
    ↓
Sector Placement
    ↓
Equity Research
    ↓
Pitch Day
    ↓
Portfolio Decisions


OUR HISTORY

2017 ─── Founded
20XX ─── Milestone
20XX ─── Milestone
2026 ─── Today
```

The exact statistics and timeline should be CMS-editable where
appropriate.

------------------------------------------------------------------------

## 6.2 Sectors Page

### Purpose

Provide a clean directory of RUIF's investment sectors while allowing
visitors to inspect the membership of each sector without navigating
away from the page.

### Main Page

Initially, the page should **not use sector photographs as the directory
cards**.

Instead, display the sector names in a clean, consistent grid or similar
layout.

Example:

``` text
OUR SECTORS

Technology        Healthcare        Financials

Energy            Industrials       Consumer

Communications    Real Estate       Natural Resources

Power / Utilities / Infrastructure  ...
```

Each sector name is clickable.

### Sector Interaction

Clicking a sector opens a polished **modal / pop-up overlay** on the
same page.

The user should not need to navigate to a separate sector page for the
initial version.

### Modal Layout

The hierarchy is important.

At the top:

-   Sector name
-   Sector Director
-   Director photograph
-   Director name

The Sector Director's photograph should be **square and visually
dominant**.

Below the director, display sector members in rows of **three**.

Each member should have:

-   Square photograph
-   Name

Conceptually:

``` text
                 TECHNOLOGY

          ┌─────────────────────┐
          │                     │
          │                     │
          │   SECTOR DIRECTOR   │
          │      PHOTO          │
          │                     │
          │                     │
          └─────────────────────┘
               Jane Smith
             Sector Director


     ┌─────────┐  ┌─────────┐  ┌─────────┐
     │ Member  │  │ Member  │  │ Member  │
     │  Photo  │  │  Photo  │  │  Photo  │
     └─────────┘  └─────────┘  └─────────┘
       Name 1       Name 2       Name 3


     ┌─────────┐  ┌─────────┐  ┌─────────┐
     │ Member  │  │ Member  │  │ Member  │
     │  Photo  │  │  Photo  │  │  Photo  │
     └─────────┘  └─────────┘  └─────────┘
       Name 4       Name 5       Name 6
```

### Director Image Sizing

The Director image should be square while having approximately the
**combined visual width of the three smaller member photographs and
their spacing**.

This deliberately creates a clear hierarchy:

``` text
             DIRECTOR
        ┌─────────────────┐
        │                 │
        │                 │
        │                 │
        └─────────────────┘

        MEMBER GRID BELOW

     ┌─────┐ ┌─────┐ ┌─────┐
     │     │ │     │ │     │
     └─────┘ └─────┘ └─────┘
```

The modal should be responsive. On smaller screens, the member grid can
collapse appropriately while preserving the director-first hierarchy.

All names, roles, photographs, and sector membership should come from
Sanity.

------------------------------------------------------------------------

## 6.3 Board Page

### Purpose

Present RUIF's current executive leadership.

### Design Direction

For the initial rebuild, **preserve the general Board design and
hierarchy of the existing Rice Finance website** rather than redesigning
the page from scratch.

The implementation should recreate that presentation cleanly in the new
Next.js design system while improving:

-   Responsiveness
-   Spacing
-   Typography consistency
-   Image quality
-   Maintainability

Board data should nevertheless come from the central Person model in
Sanity.

This allows the visual design to remain familiar while eliminating the
maintenance problems of the existing Wix implementation.

------------------------------------------------------------------------

## 6.4 Alumni Page

### Purpose

Show the long-term community and professional outcomes of RUIF members.

### Initial Constraint

A complete historical alumni database is not currently available.

Therefore, the initial build should create a **mock / demonstration
version of the intended Alumni page** using a limited number of sample
entries.

The page should be designed so that real alumni records can later be
added through Sanity without redesigning the page.

### Draft Layout

``` text
ALUMNI

Where RUIF Members Go

[Company logos / representative destinations]


CLASS OF 20XX

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│    Photo    │  │    Photo    │  │    Photo    │
└─────────────┘  └─────────────┘  └─────────────┘
 Name             Name             Name
 Company          Company          Company
 Role             Role             Role
 Location         Location         Location


CLASS OF 20XX

...
```

Potential future filtering could include:

``` text
All | Investment Banking | Investing | Consulting | Other
```

but filtering is not required for the first implementation.

Suggested alumni fields:

-   Name
-   Photo
-   Graduation year
-   Former RUIF position
-   Former sector
-   Employer
-   Role
-   Location
-   LinkedIn

------------------------------------------------------------------------

## 6.5 Portfolio Page

### Purpose

Present RUIF as a real student-run investment fund and communicate
portfolio scale, composition, process, and selected investments.

### Draft Layout

``` text
OUR PORTFOLIO


$XX,XXX
Assets Under Management

+XXX%
Return Since Inception

XX
Sectors

2017
Fund Established
```

### Portfolio Allocation

Include a polished portfolio allocation visualization.

Example:

``` text
PORTFOLIO ALLOCATION

Technology             XX%
Healthcare             XX%
Energy                 XX%
Financials             XX%
Industrials            XX%
...
```

A chart can be used in the final implementation.

### Selected Holdings

``` text
SELECT HOLDINGS

Microsoft
NVIDIA
Alphabet
Cheniere Energy
...
```

The design may use company names/logos or clean holding cards depending
on the final visual direction.

### Investment Process

``` text
OUR INVESTMENT PROCESS

Research
   ↓
Sector Discussion
   ↓
Stock Pitch
   ↓
Investment Committee / Pitch Day
   ↓
Portfolio Allocation
```

Portfolio statistics, allocations, and selected holdings should be
CMS-editable so they can be refreshed each semester.

------------------------------------------------------------------------

## 6.6 Training Program Page

### Purpose

Explain the RUIF Training Program and convert interested students into
applicants.

### Hero

``` text
RUIF TRAINING PROGRAM

Learn Finance.
Apply It.
Join the Fund.

[ Apply Now ]
```

### Process

``` text
HOW IT WORKS

01
Apply

02
Training Sessions

03
Complete Training

04
Pitch Interview

05
Join a Sector
```

### Curriculum

Create a clean session-by-session curriculum section.

Initial concept:

``` text
SESSION 1
Financial Statements

SESSION 2
Accounting

SESSION 3
Valuation

SESSION 4
DCF

SESSION 5
Public Markets

SESSION 6
Stock Pitches

SESSION 7
Pitch Preparation
```

Exact session names and content can be updated later.

### Recruitment Information

``` text
SPRING / FALL 20XX APPLICATIONS

Applications Open:
[Date]

Deadline:
[Date]

[ APPLY ]
```

Application status, dates, links, and curriculum information should be
editable through Sanity.

The Apply button can disappear or change state when recruiting is
closed.

------------------------------------------------------------------------

## 6.7 Contact Us Page

### Purpose

Provide a straightforward way to reach RUIF.

The page should remain intentionally simple and broadly similar to the
existing website.

### Draft Layout

``` text
CONTACT RICE FINANCE

Have a question about Rice Finance, the Training Program,
the portfolio, or working with RUIF?

General Inquiries
[email]

Training Program
[email, if appropriate]

President
[email, if appropriate]


────────────────────────────────

Name
[                         ]

Email
[                         ]

Subject
[                         ]

Message
[                         ]
[                         ]
[                         ]

[ Send Message ]
```

The form can ultimately be handled through a lightweight service or
serverless endpoint. A full database is unnecessary merely to support
contact submissions.

------------------------------------------------------------------------

# 7. Homepage

The detailed homepage design remains to be finalized.

It should ultimately serve as a concise gateway into the major parts of
the site rather than duplicating large amounts of information from the
About, Training, Board, and Alumni pages.

Likely homepage elements include:

-   Strong hero section
-   Short RUIF description
-   Key fund statistics
-   Links to Sectors and Portfolio
-   Training Program / recruiting call-to-action
-   Selected club photography
-   Alumni / institutional credibility
-   Contact or application CTA

The homepage should use the same Rice Blue, white, and black design
system as the rest of the site.

------------------------------------------------------------------------

# 8. Responsive Design Requirements

The entire website must be designed mobile-first/responsively.

Particular attention should be paid to:

-   Navigation on phones
-   Sector modal behavior
-   Three-column member grids
-   Board photographs
-   Alumni grids
-   Portfolio charts
-   Training Program timeline/process
-   Typography scaling

Desktop layouts should not simply shrink on mobile. Components should
deliberately reflow into mobile-appropriate arrangements.

------------------------------------------------------------------------

# 9. Editing Permissions and Guardrails

Future officers should be able to change **content without accidentally
redesigning the website**.

CMS users should generally be allowed to:

-   Change text
-   Upload/replace photographs
-   Add/remove people
-   Assign members to sectors
-   Change Board positions
-   Add alumni
-   Update portfolio information
-   Change application dates
-   Change application links
-   Update contact details

They should generally **not** control through the CMS:

-   Typography
-   Site colors
-   Core navigation structure
-   CSS
-   Grid definitions
-   Fundamental page layouts

This keeps the site visually consistent across leadership transitions.

------------------------------------------------------------------------

# 10. Development Principles

The rebuild should follow these principles:

1.  **Content and presentation are separate.**
2.  **Routine updates require no coding.**
3.  **The club---not an individual student---owns the infrastructure.**
4.  **The design system remains consistent across pages.**
5.  **All major layouts are responsive.**
6.  **Reusable components are preferred over page-specific
    duplication.**
7.  **People are stored once and referenced throughout the site.**
8.  **Sector membership is data-driven.**
9.  **Future officers can use AI-assisted development for larger
    changes.**
10. **The first version should remain technically simple unless
    additional complexity solves a real problem.**

------------------------------------------------------------------------

# 11. Initial Build Scope

### Pages

-   [ ] Homepage
-   [ ] About
-   [ ] Sectors
-   [ ] Board
-   [ ] Alumni
-   [ ] Portfolio
-   [ ] Training Program
-   [ ] Contact Us

### Infrastructure

-   [ ] Create RUIF GitHub Organization/repository
-   [ ] Create Next.js + TypeScript project
-   [ ] Configure Tailwind
-   [ ] Create reusable design system
-   [ ] Create Sanity project
-   [ ] Define CMS schemas
-   [ ] Connect frontend to Sanity
-   [ ] Create Vercel project
-   [ ] Connect GitHub to Vercel
-   [ ] Configure preview deployments
-   [ ] Connect `financegroup.rice.edu`
-   [ ] Add analytics if desired

### CMS

-   [ ] Person schema
-   [ ] Sector schema
-   [ ] Portfolio schema
-   [ ] Training Program schema
-   [ ] Site settings schema
-   [ ] Contact information
-   [ ] Alumni-ready fields

------------------------------------------------------------------------

# 12. Guiding Principle

The rebuild should create a website that looks professionally designed
today **and remains usable by RUIF several leadership generations from
now**.

The technical test is simple:

> A new officer with no coding experience should be able to update the
> Board, sectors, photographs, portfolio information, recruiting dates,
> and contact information without touching GitHub.

At the same time, the underlying Git-based application should give
technically capable officers complete control when the organization
wants to make larger design or functionality changes.
