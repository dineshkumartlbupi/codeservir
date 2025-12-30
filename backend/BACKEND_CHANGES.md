# Backend Implementation Changes

## 1. Database Schema
- **New Table**: `user_subscriptions` added to track email-based subscriptions (Free/Premium).
- **Updated Table**: `chatbots` table indexed by `contact_email` for fast lookups.
- **Initialization Script**: Created `src/scripts/init-db.ts` to automatically set up the schema.

## 2. API Endpoints Implemented

### Chatbot Limits & Management
- `POST /api/chatbot/check-limit`: Checks if an email has reached the 5-chatbot limit.
- `POST /api/chatbot/by-email`: Lists all chatbots associated with an email (for unauthenticated/authenticated management).
- `POST /api/chatbot/create`: Validates limit and creates chatbot.
- `PUT /api/chatbot/:chatbotId`: Update chatbot details.
- `DELETE /api/chatbot/:chatbotId`: Delete a chatbot.

### Dashboard Stats
- `GET /api/dashboard/stats`: Returns aggregated statistics:
  - Total Conversations (across all chatbots)
  - Active Chatbots count
  - Total Messages
  - Current Plan Type (Free/Premium)

## 3. Logic & Services
- **ChatbotService**: Added logic to count chatbots by email and check against `user_subscriptions`.
- **ChatbotModel**: Added queries for `findByEmail`, `countByEmail`, `update`, `delete`.
- **UserSubscriptionModel**: Created to manage user-level plans.

## 4. Middleware/Auth
- `ChatbotController` now handles email-based lookups for the "My Chatbots" feature functionality.

## 5. Deployment
- Run `npm install` in `backend` folder.
- Run `npx ts-node src/scripts/init-db.ts` to setup database.
- Run `npm run dev` to start the server (default port 5001).
