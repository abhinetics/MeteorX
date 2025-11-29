<div align="center">

# 🌌 **Meteorx**

## ⚡ MERN + Realtime + AI-Ready IDE

---

<!-- 🌗 Dark/Light Mode Auto-switch Badges -->

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Meteorx-Dark_Mode-000?style=for-the-badge">
  <img src="https://img.shields.io/badge/Meteorx-Light_Mode-fff?style=for-the-badge">
</picture>

</div>

---

# 🧰 **Tech Stack Overview**

<details>
<summary>✨ Click to Expand Tech Icons</summary>
<br>
<div align="center">

| Category      | Tech                                                                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**   | ![Express](https://img.shields.io/badge/Express-000?logo=express\&style=for-the-badge) ![Node](https://img.shields.io/badge/Node.js-3c873a?logo=node.js\&style=for-the-badge) |
| **Database**  | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb\&style=for-the-badge) ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge)       |
| **Auth**      | ![JWT](https://img.shields.io/badge/JWT-000?logo=jsonwebtokens\&style=for-the-badge)                                                                                          |
| **Realtime**  | ![Socket.io](https://img.shields.io/badge/Socket.IO-000?logo=socket.io\&style=for-the-badge)                                                                                  |
| **Cache**     | ![Redis](https://img.shields.io/badge/Redis-D82C20?logo=redis\&style=for-the-badge)                                                                                           |
| **AI**        | ![@google/genai](https://img.shields.io/badge/Google_GenAI-4285F4?logo=google\&style=for-the-badge)                                                                           |
| **Utilities** | ![dotenv](https://img.shields.io/badge/Dotenv-ecd53f?style=for-the-badge) ![morgan](https://img.shields.io/badge/Morgan-000?style=for-the-badge)                              |

</div>
</details>

---

# 🧩 **Backend Architecture Diagram (Express + JSON + CORS)**

```mermaid
flowchart TD
A[Client App] --> B[CORS Layer]
B --> C[JSON Body Parser]
C --> D[Express Router]
D --> E[Controllers]
E --> F[MongoDB + Mongoose]
```

---

# 🔥 **Additional System Diagrams**

## 🔴 Redis Caching Flow

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Redis
    participant DB

    Client->>API: Request Data
    API->>Redis: Check Cache
    alt Cached
        Redis-->>API: Return Cached Data
        API-->>Client: Send Cached Response
    else Not Cached
        API->>DB: Query Database
        DB-->>API: Data
        API->>Redis: Save to Cache
        API-->>Client: Send Fresh Response
    end
```

## 🟣 JWT Authentication Flow

```mermaid
sequenceDiagram
    Client->>API: Login Credentials
    API->>JWT: Generate Token
    JWT-->>Client: Return JWT
    Client->>API: Access Protected Route (JWT)
    API->>JWT: Verify Token
    JWT-->>API: Valid
    API-->>Client: Data
```

## 🟦 Project File Syncing (Realtime)

```mermaid
sequenceDiagram
    User1->>Socket: Edit File
    Socket->>Server: Broadcast Patch
    Server->>User2: Update File Tree
    Server->>DB: Persist File Structure
```

---

# 📂 **Folder Structure (Collapsible)**

<details>
<summary>📁 Click to Expand Folder Tree</summary>
<br>

```
Meteorx/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
└── README.md
```

</details>

---

# 🤖 **AI Features (Google GenAI Examples)**

```js
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const response = await model.generateContent("Explain Meteorx architecture.");
console.log(response.text());
```

---

# 🔥 **API Documentation (Professional Format)**

<details>
<summary>📌 Click to Expand User APIs</summary>
<br>

## 👤 User APIs

* **POST /users/register** → Creates a new user
* **POST /users/login** → Authenticates user & issues JWT
* **GET /users/profile** → Returns current user
* **GET /users/logout** → Invalidates current session
* **GET /users/all** → List all users except current user

</details>

<details>
<summary>📌 Click to Expand Project APIs</summary>
<br>

## 🗂️ Project APIs

* **POST /projects/create** → Creates project & assigns user
* **GET /projects/all** → Lists user projects
* **GET /projects/get-project/:projectId** → Full project details
* **PUT /projects/add-user** → Add collaborators
* **PUT /projects/update-file-tree** → Save file code & structure

</details>

---

# 🔐 Environment Variables

> **Note:** Your secret keys and passwords are **not** included here. Replace the placeholder values with your real secrets in a secure `.env` file and never commit them to source control.

```
PORT=8080
MONGO_URI=mongodb://localhost:27017/devin
JWT_SECRET=<YOUR_JWT_SECRET>

# Redis (host/port only; keep the password secret)
REDIS_HOST=<your_redis_host>
REDIS_PORT=<your_redis_port>
REDIS_PASSWORD=<YOUR_REDIS_PASSWORD>

# Google AI (keep key secret)
GOOGLE_AI_KEY=<YOUR_GOOGLE_AI_KEY>
```

---

## 🔁 Full API Routes (HTTP Method, Route, Description)

| Method | Route                              | Description                                                                                                            |
| ------ | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| POST   | `/users/register`                  | Creates a new user account.                                                                                            |
| POST   | `/users/login`                     | Authenticates a user and issues a JWT.                                                                                 |
| GET    | `/users/profile`                   | Retrieves the profile details of the currently authenticated user (Protected Route).                                   |
| GET    | `/users/logout`                    | Invalidates the user's current session/token.                                                                          |
| GET    | `/users/all`                       | Retrieves a list of all users in the database, excluding the currently logged-in user (Used for adding collaborators). |
| POST   | `/projects/create`                 | Creates a new project and assigns the current user as a collaborator (Protected Route).                                |
| GET    | `/projects/all`                    | Retrieves a list of all projects the authenticated user is a part of (Protected Route).                                |
| GET    | `/projects/get-project/:projectId` | Retrieves detailed information for a specific project, including file tree and collaborators (Protected Route).        |
| PUT    | `/projects/add-user`               | Adds new collaborators (users) to an existing project (Protected Route).                                               |
| PUT    | `/projects/update-file-tree`       | Updates and persists the project's file structure (code) after a user makes edits (Protected Route).                   |

---

# ⚙️ Installation

```bash
git clone https://github.com/yourname/Meteorx
cd Meteorx/backend
npm install
npm start
```

---
