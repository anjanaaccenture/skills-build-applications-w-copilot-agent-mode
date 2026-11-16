# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

Record your plan here before editing code.

- Presentation tier decision: Build React components for each route (Activities, Teams, Leaderboard, Workouts) using the shared API client. Each component will manage loading, empty, success, and error states separately. Start with page stubs, then populate with API calls and UI rendering.
- Logic tier decision: Create Express routes under `/api/*` with accompanying service functions. Validate input in routes, delegate business logic to services. Return 400 for validation errors (never 500 from cast errors). Seed demo data once at startup.
- Data tier decision: Define four Mongoose schemas (User, Team, Activity, Workout) with field-level validation. User stores name, email, and fitnessGoal. Team stores name, mascot, and member refs. Activity stores type, user, team, minutes, plus computed points and occurredAt. Workout stores title, focus, minutes, and difficulty.
- Activity tracking approach: POST creates an activity with user/team validation; compute points from type. GET returns all activities. Reject invalid user or team IDs with 400, not 500.
- Team management approach: POST creates teams with name validation (required, 400 if missing). GET lists teams with expanded members. Accept optional mascot field.
- Leaderboard approach: GET aggregates all activities grouped by team, sums points per team, then ranks by total points descending. Return `teamName`, `totalPoints`, and 1-based `rank`.
- Workout suggestions approach: GET by user email finds matching seeded user, analyzes their recent activity types, then recommends a workout whose focus matches their goal or activity pattern. Return `title`, `focus`, and `reason` explaining the recommendation.

## Test plan

Record the commands you run and what each failure means.

- **Data-tier command**: `npm run test:data --prefix octofit-tracker/backend` — Validates Mongoose schema definitions. Failures indicate missing field validation (required, type, enum constraints). Success: 5/5 tests pass when User, Team, Activity, and Workout schemas have required fields enforced.
- **API command**: `npm run test:api --prefix octofit-tracker/backend` — Validates API contract (endpoints, status codes, response shape, business logic). Failures indicate missing routes, missing service logic, or routes returning 501 instead of 400 for validation errors. Success: 4/4 tests pass when all endpoints are implemented.
- **Frontend command**: `npm test --prefix octofit-tracker/frontend` — Validates React components render and fetch data from API. Failures indicate missing components or missing API integration. Success: 15/15 tests pass when all four pages (Activities, Teams, Leaderboard, Workouts) are fully implemented.
- **Backend build command**: `npm run build --prefix octofit-tracker/backend` — Compiles TypeScript to JavaScript. Run after each logic tier change to catch type errors.
- **Frontend build command**: `npm run build --prefix octofit-tracker/frontend` — Bundles React app with Vite. Run after each presentation tier change to catch build errors.
