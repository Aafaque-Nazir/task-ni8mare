# LibroSys - Premium Library Management Software

LibroSys is a modern, production-ready, console and web-based Library Management Software built with Next.js App Router, React, and Vanilla CSS. It provides a jaw-dropping premium UI/UX design featuring glassmorphism and stunning color palettes.

## Features

- **Book Management**: Add, update, delete, and list books. Books have attributes such as Book ID, Title, Author, Year of Publication, and Status (Available, Checked Out).
- **Patron Management**: Add, update, and delete library patrons. Patrons have attributes such as Patron ID, Name, and a list of Books Checked Out.
- **Library Operations**: 
  - **Checkout Book**: Allows patrons to check out books that are available. Updates the book status and patron's record.
  - **Return Book**: Allows patrons to return checked-out books.
- **Data Storage**: Utilizes local file storage (`data/books.json` and `data/patrons.json`) using Node.js `fs` to simulate a database.
- **Premium UI**: Dark mode, glassmorphic effects, modern typography, and responsive design.

## Prerequisites

- Node.js (v18.17 or later)
- npm, yarn, or pnpm

## How to Compile and Run

1. **Install dependencies:**
   Open your terminal in the root directory of the project and run:
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the application:**
   Navigate to `http://localhost:3000` in your web browser. You will see the Dashboard where you can manage your library.

## Project Structure

- `src/lib/store.ts`: Handles data models and local file storage logic (JSON read/write).
- `src/lib/actions.ts`: Next.js Server Actions handling data mutations.
- `src/app/`: Contains the Next.js pages, routing, and styling (`globals.css`).
- `data/`: Contains the JSON files used for data persistence (auto-generated when you add data).

## Built With

- Next.js (App Router, Server Actions)
- React
- Lucide React (Icons)
- Vanilla CSS (Glassmorphism, gradients, CSS variables)
