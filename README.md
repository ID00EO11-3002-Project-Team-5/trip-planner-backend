# trip-planner-backend

Overview

This repository contains the backend implementation for the Collaborative Trip Planner application.
The backend is responsible for handling API requests, validating data, performing expense and settlement calculations, and preparing the system for database and authentication integration using Supabase.

The project is designed using a layered architecture to ensure maintainability, scalability, and clear separation of concerns.

Tech Stack
Backend

Node.js + TypeScript – Server-side runtime and type-safe development

Express – REST API framework

Zod – Request validation

Decimal.js – Accurate financial calculations

Database & Realtime (Planned / Partially Integrated)

Supabase

PostgreSQL

Authentication

Row Level Security (RLS)

Realtime subscriptions

File storage

Testing & Tooling

Jest – Unit testing

Thunder Client – Manual API testing during development

GitHub Actions – CI/CD

Project Structure
src/
├── app.ts # Express app configuration
├── server.ts # Server bootstrap
├── config/
│ └── supabaseClient.ts # Supabase client configuration (ready)
├── routes/
│ ├── expenses.routes.ts
│ └── settlements.routes.ts
├── services/
│ ├── splitBill.service.ts
│ └── settlement.service.ts
├── validators/
│ └── expense.schema.ts
├── middleware/ # Reserved for auth & validation middleware
└── controllers/ # Reserved for controller logic

tests/
└── settlement.service.test.ts

Implemented Features

1. REST API Skeletons

POST /expenses
Accepts expense data and returns a mock response.

POST /settlements
Calculates who owes whom based on user balances.

These endpoints are fully functional and ready for database integration.

2. Request Validation

Zod is used to validate incoming requests for the /expenses endpoint.

Invalid input is rejected with meaningful error messages and HTTP 400 responses.

3. Business Logic

Split Bill Logic
Calculates individual balances from shared expenses.

Settlement Logic
Determines the minimum number of transactions required to settle debts.

Decimal.js is used to ensure accurate financial calculations.

4. Testing

Unit tests are written using Jest for the settlement calculation logic.

Test files are excluded from the production TypeScript build and run independently.

5. Manual API Testing

Thunder Client is used during development to manually test API endpoints and validate request/response behavior.
