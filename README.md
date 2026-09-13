# Talent IQ — Coding Interview Platform

A full-stack MERN application for practicing coding problems and running one-to-one technical interview sessions. Talent IQ brings problem statements, a multi-language editor, code execution, video calls, and chat into one responsive workspace.

**Built with:** React 19 · Node.js · Express 5 · MongoDB · Clerk · Stream · Inngest

## Project at a glance

| Area | What the application delivers |
| --- | --- |
| Coding practice | Curated problems with difficulty levels, examples, constraints, starter code, and expected-output feedback |
| Interview sessions | Create, discover, join, rejoin, and end sessions with a host and one participant |
| Communication | Live video calls and session chat through Stream |
| Code execution | JavaScript, Python, and Java execution through a backend integration with OneCompiler |
| Dashboard | Active-session discovery, session counts, and completed-session history |
| Responsive design | Stacked coding panels on mobile and tablet, resizable panes on wider screens, and touch-friendly controls |

## Engineering highlights

- **Full-stack session lifecycle:** Express controllers coordinate MongoDB session records with Stream calls and chat channels. The API checks session capacity, participant eligibility, and host permission when ending a session.
- **Identity across services:** Clerk handles authentication. Inngest functions process user-created and user-deleted events to synchronize application users with MongoDB and Stream.
- **Separated client and server responsibilities:** React components handle presentation, custom hooks manage API and communication state, and backend routes delegate session operations to controllers.
- **External execution service:** Code runs through OneCompiler, with its API key kept on the backend. The UI displays execution output and errors alongside the editor.
- **Responsive coding workspace:** Monaco provides syntax highlighting and language switching. CSS adapts the existing panel tree across breakpoints without remounting the editor during a viewport resize.
- **Server-state management:** TanStack Query manages session queries and mutations; the session detail view polls for updates, including session completion.

## Explore the application

1. Sign in and open the dashboard to view active sessions and your history.
2. Open **Problems**, choose a challenge, and select JavaScript, Python, or Java.
3. Edit the starter code and use **Run Code** to inspect output and practice feedback.
4. Create a session from the dashboard and join it from a second account to try the interview flow.
5. Use video and chat to discuss the solution, then end the session as the host.

**Current scope:** Video and chat are real-time. Editor contents are local to each participant; synchronized editing and shared cursors are not implemented. Practice feedback compares program output with the expected output included in the problem data, rather than using a hidden-test judging system.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 7, React Router 7 |
| Styling | Tailwind CSS 4, daisyUI 5, Lucide icons |
| Editor | Monaco Editor, react-resizable-panels |
| API state | TanStack Query, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | Clerk React and Express SDKs |
| Video and messaging | Stream Video and Stream Chat |
| Background workflows | Inngest |
| Code execution | OneCompiler API |

## Architecture

```text
React / Vite client
  ├── Clerk                         Sign-in and identity
  ├── Express API
  │     ├── MongoDB                 Users and interview sessions
  │     ├── Stream server SDKs      Call/channel creation and user tokens
  │     └── OneCompiler             Remote code execution
  └── Stream client SDKs            Live video and chat

Clerk user events → Inngest → MongoDB and Stream user synchronization
```

## Run locally

### Prerequisites

- Node.js **20.19+ within the 20.x release line** and npm. The root package targets Node 20.x; Vite 7 requires a sufficiently recent Node release.
- A MongoDB database, local or hosted.
- Clerk, Stream Video/Chat, Inngest, and OneCompiler credentials.

### 1. Clone and install

```bash
git clone https://github.com/ribhupramanik/MERN-Interview-Platform.git
cd MERN-Interview-Platform
npm ci --prefix backend
npm ci --prefix frontend --legacy-peer-deps
```

The frontend installation uses `--legacy-peer-deps` because the current dependency tree contains conflicting peer requirements among the chat/UI packages.

### 2. Configure environment variables

Create `backend/.env`:

```dotenv
PORT=5000
NODE_ENV=development
DB_URL=mongodb://127.0.0.1:27017/talent-iq
CLIENT_URL=http://localhost:5173

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

STREAM_API_KEY=your_stream_api_key
STREAM_SECRET_KEY=your_stream_secret_key

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

ONECOMPILER_API_KEY=your_onecompiler_api_key
```

Create `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
```

Use matching Clerk and Stream applications on both sides. `VITE_API_URL` must include `/api`. Only public keys belong in `VITE_*` variables, which are included in the browser bundle; keep secret keys in the backend environment. Environment files are gitignored.

### 3. Connect user synchronization

The backend exposes Inngest functions at `/api/inngest`. Register that endpoint with your Inngest environment and configure Clerk event forwarding so the functions receive:

- `clerk/user.created`
- `clerk/user.deleted`

For local development, use an Inngest development setup and a reachable webhook endpoint or tunnel for Clerk event delivery. The repository contains the event handlers; it does not automatically configure provider dashboards or event forwarding.

Complete synchronization before creating or joining sessions. Protected session routes require a MongoDB user record matching the signed-in Clerk user. For accounts created before event forwarding was configured, replay the user-created event through the configured workflow.

### 4. Start the application

In one terminal:

```bash
cd backend
npm run dev
```

In another terminal, from the repository root:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`. Allow camera and microphone access when trying video calls. A full interview walkthrough requires two signed-in accounts and configured external services.

## Build and validation

```bash
# Build the frontend
npm run build --prefix frontend

# Run frontend static analysis
npm run lint --prefix frontend
```

For a combined production deployment, set `NODE_ENV=production` on the backend and configure the production `CLIENT_URL`. Build the frontend with the production API URL, then run `npm start` from the repository root. The root start script launches the backend, which serves `frontend/dist` in production and provides the SPA fallback.

Responsive layout checks covered all five screens at widths from 320px to 1536px, plus a landscape phone viewport. Checks used sample session data and included language switching, touch-target sizing, and preserving editor contents across a resize. These are browser layout checks, not an end-to-end verification of live provider integrations.

The frontend production build passes. Existing lint findings in the coding pages remain; there is currently no committed automated test suite.

## Repository guide

```text
frontend/src/
  pages/          Landing, dashboard, problem list, practice, and session views
  components/     Navigation, editor, output, session cards, video, and chat UI
  hooks/          Session queries/mutations and Stream connection lifecycle
  data/           Problem definitions, starter code, and expected output
  api/            Session API methods
  lib/            HTTP, execution, Stream, and UI helpers

backend/src/
  routes/         Session, chat-token, and code-execution endpoints
  controllers/    Session lifecycle and chat-token handlers
  middleware/     Clerk authentication and application-user lookup
  models/         MongoDB user and session schemas
  lib/            Database, Stream, environment, and Inngest configuration
  server.js       Express setup and production frontend serving
```

For a code walkthrough, start with `frontend/src/pages/SessionPage.jsx`, `frontend/src/hooks/useSessions.js`, and `backend/src/controllers/sessionController.js`. Together they show the flow from UI interaction to persisted session state and external-service integration.

## Future improvements

- Shared editor state and collaborative cursors.
- Automated coverage for session authorization, concurrent joins, and provider failures.
- Stronger code-execution request validation, authentication, and rate limiting.
- Hidden test cases and a more robust result-comparison system.
- Resolve lint findings and reduce the frontend bundle through route-level code splitting.

## Author

**Ribhu Pramanik** · [GitHub](https://github.com/ribhupramanik)
