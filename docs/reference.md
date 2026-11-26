# Food Court Web App reference

## Feature map

The [browser router](../src/app/router.tsx) gives customers, employees, owners, and administrators separate layouts and route guards.

| Feature | Routes | Responsibilities |
| --- | --- | --- |
| Auth | `/login`, `/register` | Sign in, register a customer, and direct signed-in users to the workspace for their role |
| Client | `/client/restaurants`, `/client/restaurant/:id`, `/client/cart`, `/client/orders` | Browse restaurants and available dishes, adjust the cart, place orders, and track their status |
| Employee | `/employee/orders` | Work the kitchen queue: take an order, mark it ready, and confirm pickup with a PIN |
| Owner | `/owner/dashboard`, `/owner/dishes`, `/owner/dish/create`, `/owner/dish/edit/:id`, `/owner/create-employee`, `/owner/analytics` | Manage dishes and availability, create employee accounts, and review fulfillment reports |
| Admin | `/admin/dashboard`, `/admin/create-owner`, `/admin/create-restaurant` | View platform activity and register owners and restaurants |

The case study uses a seeded restaurant because the Catalog API’s owner lookup does not match the Identity API route. It also records a category-field mismatch in the owner’s dish table. Those are integration limitations, not requirements for starting Vite.

## Placement rules

Organize features by what users do, not by technical layer. Keep components, queries, services, and state inside one feature while only that feature uses them. Move reusable pieces to `src/shared/` when two or more features need them. Put cross-cutting mechanisms such as the Axios client, session store, query client, and theme in `src/infrastructure/`. The app shell, router, guards, and layouts belong in `src/app/`; static assets belong in `src/assets/`.

The main container’s filename matches the feature, for example [`src/features/client/client.tsx`](../src/features/client/client.tsx). Containers handle orchestration, state, and data fetching; presentational components receive props and render the interface. TanStack Query handles server data, while Zustand stores client state such as the cart and authentication.

## Environment

The browser calls all four APIs directly. The checked-in [endpoint configuration](../src/infrastructure/api/endpoints.ts) sets these localhost defaults, so a local environment file is optional. If you need overrides, start from the repository’s `.env.example` or supply the variables below before starting or building Vite. Never put secrets in `VITE_` variables: their values can be visible to the browser.

| Name | Purpose | Default |
| --- | --- | --- |
| `VITE_API_USUARIOS_URL` | Accounts, registration, and sign-in | `http://localhost:8090/user-api` |
| `VITE_API_PLAZOLETA_URL` | Restaurants, dishes, and availability | `http://localhost:8091/foodcourt-api` |
| `VITE_API_PEDIDOS_URL` | Checkout, kitchen queue, and pickup | `http://localhost:8092/order-api` |
| `VITE_API_TRAZABILIDAD_URL` | Order history and fulfillment reports | `http://localhost:8093/traceability-api` |

The shared Axios client uses a fixed 15-second timeout. The generic API base URL, timeout, token-key, and feature-flag declarations in [`vite-env.d.ts`](../src/vite-env.d.ts) do not configure this runtime: the application reads the four service-specific variables above.

## Authentication

1. `/login` sends `email` and `password` to Identity’s `POST /auth/login`; `/register` uses `POST /user/client` to create a customer. These paths are relative to `VITE_API_USUARIOS_URL`.
2. On sign-in, the frontend saves the returned JWT in browser `localStorage` under `jwt_token`. It decodes the account ID and the first role to choose the workspace; owner and employee screens can read `restaurantId` when the token includes it. The shared [Axios client](../src/infrastructure/api/axiosInstance.ts) attaches `Authorization: Bearer <token>` to API requests when a token exists.
3. The guest and protected-route guards check stored token expiration. Signed-in users landing on the guest routes are sent to their workspace; unauthenticated users requesting protected routes are sent to `/login`. The role guard denies entry to a workspace for another role. These browser checks control navigation; the backend services still verify and authorize requests.
4. Signing out clears the JWT. A `401` outside sign-in clears the session and sends the browser to `/login` with an expiration message. A failed login is handled by the login form rather than the session-expired flow.

## Scripts

Use Node.js 24 and npm, matching [CI](../.github/workflows/ci.yml). The workflow installs with `HUSKY=0 npm ci` and runs `npm test -- --run`; it does not run the production build or Playwright.

| Command | Purpose |
| --- | --- |
| `HUSKY=0 npm ci` | Install the locked dependencies without configuring Git hooks |
| `npm run prepare` | Configure Husky hooks when wanted |
| `npm run dev` | Start Vite at `http://localhost:3000` |
| `npm run build` | Type-check with `tsc` and build with Vite |
| `npm run preview` | Serve the built bundle at `http://localhost:3000` |
| `npm test` / `npm test -- --run` | Start Vitest (watch by default locally) / run once |
| `npm run test:ui` / `npm run test:coverage` | Open the Vitest UI / request coverage (requires a coverage provider that is not included in the lockfile) |
| `npm run lint` / `npm run lint:fix` | Run ESLint / apply available fixes |
| `npm run format:check` / `npm run format` | Check / apply Prettier formatting in `src/` |

The [Playwright configuration](../playwright.config.ts) points Chromium at `http://localhost:3000` and does not start a web server. Start the frontend separately and have the required Food Court APIs and accounts available for authenticated browser scenarios.

## System diagrams

- [System context](project-architecture.png) — actors, web app, services, and data stores.
- [SQL entities](sql-entities-diagram.png) — historical relational design. In the current system, Identity and Catalog use PostgreSQL; Order does not.
- [Document entities](nosql-entities-diagram.png) — order and trace models; the APIs own separate MongoDB databases.
- [Order lifecycle](order-flow-diagram.png) — states from pending through delivery or cancellation.

## UI screenshots

Earlier captures: [sign-in](00-login.png); customer views [1](01-client.png), [2](02-client.png), [3](03-client.png), and [4](04-client.png); [kitchen](05-employee.png); owner views [1](06-owner.png) and [2](07-owner.png); [administration](08-admin.png). The [README preview](../README.md#preview) shows the portfolio captures from the local run.
