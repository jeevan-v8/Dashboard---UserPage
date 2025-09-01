
# Admin Dashboard – Users Page

A small Admin Dashboard built with React + TypeScript + Vite.
Implements a metadata-driven data grid using Material React Table (MRT), with mocked APIs via MSW.

---

## 🚀 Tech Stack

	•	React 18+ with TypeScript (strict mode)
	•	Vite for fast bundling
	•	Material UI + Material React Table (MRT)
	•	MSW (Mock Service Worker) for API mocking
	•	Axios for API requests
	•	ESLint + Prettier for linting/formatting
	•	Vitest + React Testing Library + MSW for unit testing

---

## ✨ Features

### Users Grid
	•	Metadata-driven columns (string, badge, date, chiplist)
	•	Sorting, filtering, pagination (server-side via MSW)
	•	Row virtualization for performance

### Row Actions
	•	Row selection
	•	Toggle user status (Activate/Deactivate) with optimistic UI
	•	Snackbar feedback (success/error)
### Search
	•	Global search
	•	Per-column search filters
### 	UX
	•	Empty states (No users found)
	•	Loading skeletons + spinners
	•	Error boundary for safe rendering
	•	Accessible labels for actions


## Folder Strucutre 

```
src/
├── api/              # Axios services
│   └── users.ts
├── components/       # Reusable components
│   └── ErrorBoundary.tsx
├── mocks/            # MSW handlers + browser setup
│   ├── handlers.ts
│   └── browser.ts
├── models/           # TypeScript models
│   └── types.ts
├── pages/            # Route-based pages
│   └── UsersPage.tsx
├── utils/            # Helpers (e.g., column metadata)
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── setupTests.ts     # Vitest + RTL setup

```
### Installation
1. Clone the repository:
   ```bash
    git clone https://github.com/your-username/admin-dashboard.git
    
    cd admin-dashboard
    npm install  # Install dependencies
    npm run dev  # Run dev server
    npm run test # Run tests


## 🧪 Tests
	•	Renders Users List title
	•	Loads users from MSW
	•	Toggles user status with optimistic update + snackbar

## 🌍 Deployment

  This project is deployed at:
  👉 Live Demo on Vercel/Netlify

## 📸 Screenshots
	•	Users Table with search & filters
	•	Toggle Status snackbar
	•	Empty state & error handling

## 👤 Author

```
Your Name (JeevanKumar R)
📧 jeevankumar.krm@gmail.com
💼 LinkedIn Profile : 
```
