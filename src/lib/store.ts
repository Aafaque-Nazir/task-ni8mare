import fs from 'fs/promises';
import path from 'path';

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  status: 'Available' | 'Checked Out';
}

export interface Patron {
  id: string;
  name: string;
  checkedOutBooks: string[]; // Array of Book IDs
}

const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKS_FILE = path.join(DATA_DIR, 'books.json');
const PATRONS_FILE = path.join(DATA_DIR, 'patrons.json');

// Ensure data directory and files exist
async function initStore() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    try {
      await fs.access(BOOKS_FILE);
    } catch {
      await fs.writeFile(BOOKS_FILE, JSON.stringify([]));
    }

    try {
      await fs.access(PATRONS_FILE);
    } catch {
      await fs.writeFile(PATRONS_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Failed to initialize store:', error);
  }
}

// Call initStore on module load (this runs on server)
initStore();

export async function getBooks(): Promise<Book[]> {
  try {
    const data = await fs.readFile(BOOKS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveBooks(books: Book[]): Promise<void> {
  await fs.writeFile(BOOKS_FILE, JSON.stringify(books, null, 2));
}

export async function getPatrons(): Promise<Patron[]> {
  try {
    const data = await fs.readFile(PATRONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function savePatrons(patrons: Patron[]): Promise<void> {
  await fs.writeFile(PATRONS_FILE, JSON.stringify(patrons, null, 2));
}
