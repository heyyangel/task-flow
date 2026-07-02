# Task Manager: AI-Powered Kanban Board 🚀

An open-source, production-ready Full Stack Task Manager application built with the MERN stack and TypeScript. This project features a beautiful drag-and-drop Kanban board, robust state management with TanStack Query, and an integrated Gemini AI to automatically suggest task descriptions and priorities.

---

## 🌟 Project Overview
Task Manager is designed to help individuals and teams organize their daily tasks efficiently. The interface is highly responsive and mobile-first, ensuring you can manage your tasks anywhere. With the integration of Google's Gemini AI, creating tasks is faster than ever—simply type a title, and the AI will auto-generate a suitable description and priority level.

## ✨ Features
- **Drag & Drop Kanban Board:** Smooth, interactive Kanban columns (To Do, In Progress, Done) powered by `@dnd-kit`.
- **AI Task Suggestions:** Utilize Gemini AI to auto-complete task details based only on a title.
- **Optimistic Updates:** Instant UI feedback on drag-and-drop and deletions for a lightning-fast user experience.
- **Premium UI:** Designed with a custom Shadcn-inspired aesthetic, featuring smooth animations, rounded corners, and soft minimal shadows.
- **Advanced Filtering:** Filter tasks instantly by Search, Status, and Priority.
- **Fully Responsive:** Adapts seamlessly from desktop grid layouts to mobile-friendly vertical stacks with floating action buttons.

---

## 🛠 Tech Stack

### Frontend
- **React 19** & **Vite**: For a lightning-fast development experience and modern concurrent rendering.
- **TypeScript**: Ensuring type safety across the entire application.
- **Tailwind CSS (v4)**: For rapid, utility-first UI styling.
- **TanStack Query (React Query)**: For declarative data fetching, caching, and optimistic updates.
- **React Hook Form** & **Zod**: For robust form validation and state management.
- **@dnd-kit**: For accessible, lightweight, and performant drag-and-drop interactions.
- **Lucide React** & **Sonner**: For modern iconography and elegant toast notifications.

### Backend
- **Node.js** & **Express**: For a fast, scalable server architecture.
- **TypeScript**: Sharing types between the frontend and backend.
- **MongoDB** & **Mongoose**: For flexible, schema-based NoSQL database management.
- **@google/genai**: For seamless integration with the Gemini AI model.
- **Helmet**, **Cors**, **Morgan**: For security, cross-origin support, and logging.

---

## 🏗 Architecture
The application follows a clean, decoupled client-server architecture:
- **Client (`/client`)**: A Single Page Application (SPA) built with Vite and React. It communicates with the backend via RESTful APIs using Axios. State is heavily reliant on server-state management (TanStack Query) rather than complex global client states.
- **Server (`/server`)**: A REST API following the Controller-Service architecture. Routes direct traffic to Controllers, which handle HTTP logic. Services handle business logic (like AI generation) and Mongoose models handle database interactions. 

---

## 📁 Folder Structure

```
task-manager/
├── client/
│   ├── src/
│   │   ├── api/            # Axios instance and API service wrappers
│   │   ├── components/     # Reusable UI components (TaskCard, KanbanColumn, ui/*)
│   │   ├── layouts/        # Global layouts (DashboardLayout)
│   │   ├── pages/          # Route-level components (Dashboard, TaskFormPage)
│   │   └── utils/          # Utility functions (cn for Tailwind classes)
│   ├── index.html
│   └── tsconfig.json
│
└── server/
    ├── src/
    │   ├── config/         # Database and environment configurations
    │   ├── controllers/    # Request/Response handlers
    │   ├── middlewares/    # Custom middlewares (Zod validation, error handling)
    │   ├── models/         # Mongoose schemas (Task)
    │   ├── routes/         # Express route definitions
    │   ├── services/       # Business logic (Gemini AI service)
    │   └── types/          # Shared Zod schemas and TypeScript interfaces
    ├── app.ts              # Express app setup
    └── server.ts           # Server entry point
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tasks` | Get all tasks (supports search, status, priority filters) |
| `GET` | `/api/tasks/:id` | Get a specific task by ID |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `POST` | `/api/tasks/ai-suggest` | Generate AI suggestions (description, priority) based on a title |

---

## 🔐 Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

---

## 🗄 Database Setup
Ensure you have MongoDB installed locally or have a MongoDB Atlas connection string.
If running locally, the default connection string in the `.env` example (`mongodb://localhost:27017/task-manager`) will automatically create the database upon the first connection.

---

## 🚀 Installation & Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   # Add your .env file here
   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

4. **Open the App**
   Navigate to `http://localhost:5173` in your browser.

---

## 🌍 Deployment

- **Backend**: Can be deployed to platforms like Render, Heroku, or DigitalOcean. Ensure you set the environment variables in the host's dashboard.
- **Frontend**: Can be built using `npm run build` and deployed to Vercel, Netlify, or Cloudflare Pages. Ensure the `api.ts` base URL points to your deployed backend URL.

---

## 🤖 AI Integration
This project leverages the official `@google/genai` SDK to connect to `gemini-2.5-flash`. The AI is strictly prompted to return a controlled JSON structure containing a description and a priority level. This ensures safe and predictable auto-completion when creating tasks.

---

## 🧗 Challenges Faced
- **Tailwind CSS v4 Transition**: Upgrading from v3 to v4 introduced changes to how CSS variables and `@apply` directives operate within Base layers. This required refactoring the custom Shadcn-inspired UI components to align with modern v4 PostCSS paradigms.
- **Drag-and-Drop Complexity**: Implementing `@dnd-kit` across varying screen sizes required configuring specific touch and pointer sensors to prevent mobile scrolling interference while ensuring smooth card tracking.

---

## 🔮 Future Improvements
- **Authentication:** Add JWT-based user authentication to isolate task lists per user.
- **Dark Mode Toggle:** Implement a global theme switcher.
- **Sub-tasks:** Allow tasks to have nested checklists for complex projects.
- **Collaborative Board:** Use WebSockets (Socket.io) to reflect drag-and-drop changes in real-time across multiple clients.

---

## 📚 Libraries Used
- **Frontend**: React, Vite, React Router, TanStack Query, React Hook Form, Zod, dnd-kit, Tailwind CSS, Lucide React, Sonner.
- **Backend**: Express, Mongoose, Zod, @google/genai, Helmet, Cors, Morgan.

---

## 🧠 AI Tools Used
This project was entirely scaffolded, architected, and built with the assistance of advanced agentic AI coding assistants, specifically highlighting the capabilities of Gemini 2.5 Flash and Google DeepMind's Antigravity IDE.

---

## 🤔 Why this stack was chosen?
The **MERN stack** provides a unified language context (TypeScript/JavaScript) from the database to the browser, significantly reducing context switching. 
- **Vite** was chosen over CRA or Next.js for its unparalleled local development speed on SPAs.
- **TanStack Query** eliminates the need for Redux by elegantly handling the complexities of async server state.
- **dnd-kit** was chosen over older libraries like `react-beautiful-dnd` because it is actively maintained, extensible, and handles mobile touch events natively.

---

## 📸 Screenshots

*(Add screenshots of your application here)*

- **Dashboard Kanban View**
- **Mobile Responsive Layout**
- **AI Task Suggestion Modal**

---

## 📄 License
This project is licensed under the MIT License. Feel free to use, modify, and distribute it as needed.
