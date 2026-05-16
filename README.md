# 📚 LibroSys — Premium Library Management System

A modern, feature-rich Library Management System built with **Next.js 16**, **React 19**, and **Vanilla CSS**. Features a stunning dark-mode UI with glassmorphism effects, smooth animations, and a fully responsive layout.

## ✨ Features

### Core Functionality
- **📖 Book Management** — Add, edit, delete, and search books with attributes like Title, Author, Year, and Status (Available / Checked Out)
- **👤 Patron Management** — Add, edit, and delete library patrons with tracked checkout history
- **🔄 Library Operations** — Checkout and return books with real-time status updates across the system
- **🔍 Debounced Search** — Instant search across books and patrons with optimized performance

### UI/UX
- 🌑 Premium dark mode design
- 🪟 Glassmorphism card effects
- ✨ Smooth page transitions (Framer Motion)
- 📱 Fully responsive (mobile hamburger menu)
- ⚡ Loading states with transitions during mutations

### Data Storage
- Utilizes **local JSON file storage** (`data/books.json` and `data/patrons.json`) via Node.js `fs` module
- Simulates database interaction without requiring a database system
- Data persists between server restarts

> **⚠️ Note:** This app uses local file storage as per the project requirements. It is designed to run locally. The filesystem is read-only on serverless platforms like Vercel, so data mutations will not work in cloud deployments.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework (App Router, Server Actions) |
| [React 19](https://react.dev/) | UI library |
| [Framer Motion](https://www.framer.com/motion/) | Page transition animations |
| [Lucide React](https://lucide.dev/) | Icon library |
| Vanilla CSS | Styling (glassmorphism, gradients, CSS variables) |
| Node.js `fs` | Local JSON file storage |

---

## 📋 Prerequisites

- **Node.js** v18.17 or later
- **npm** (comes with Node.js)

---

## 🚀 How to Run

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd task
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

That's it! The app will auto-create `data/books.json` and `data/patrons.json` on first run.

---

## 📁 Project Structure

```
task/
├── data/                    # Auto-generated JSON data files
│   ├── books.json           # Books data
│   └── patrons.json         # Patrons data
├── src/
│   ├── app/
│   │   ├── books/           # Book management page
│   │   │   ├── BookManager.tsx
│   │   │   └── page.tsx
│   │   ├── patrons/         # Patron management page
│   │   │   ├── PatronManager.tsx
│   │   │   └── page.tsx
│   │   ├── operations/      # Checkout & Return page
│   │   │   ├── OperationsClient.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css      # Global styles & design system
│   │   ├── layout.tsx       # Root layout with sidebar
│   │   └── page.tsx         # Dashboard (home page)
│   ├── components/
│   │   ├── PageWrapper.tsx   # Framer Motion page transitions
│   │   └── Sidebar.tsx       # Navigation sidebar
│   ├── hooks/
│   │   └── useDebounce.ts    # Debounce hook for search
│   └── lib/
│       ├── actions.ts        # Server Actions (CRUD operations)
│       └── store.ts          # Data models & file I/O logic
├── package.json
└── README.md
```

---

## 🧭 Pages Overview

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Overview with stats, quick actions, and recent books |
| Books | `/books` | Full CRUD for book management with search |
| Patrons | `/patrons` | Full CRUD for patron management with search |
| Operations | `/operations` | Checkout and return books |

---

## 🎨 Design Highlights

- **Color Palette:** Deep black (#050505) background with vibrant yellow (#eab308) accents
- **Typography:** Inter font family via Google Fonts
- **Cards:** Glassmorphic surfaces with hover lift animations
- **Modals:** Animated overlays with backdrop blur
- **Responsive:** Sidebar collapses to hamburger menu on mobile

---

## 📄 License

This project was built as a learning exercise for library management software development.
