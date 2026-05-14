'use server';

import { revalidatePath } from 'next/cache';
import { getBooks, saveBooks, getPatrons, savePatrons, Book, Patron } from './store';

export async function addBook(formData: FormData) {
  const books = await getBooks();
  const newBook: Book = {
    id: Date.now().toString(),
    title: formData.get('title') as string,
    author: formData.get('author') as string,
    year: parseInt(formData.get('year') as string, 10),
    status: 'Available',
  };
  
  books.push(newBook);
  await saveBooks(books);
  revalidatePath('/books');
  revalidatePath('/');
}

export async function updateBook(id: string, formData: FormData) {
  const books = await getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index > -1) {
    books[index] = {
      ...books[index],
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      year: parseInt(formData.get('year') as string, 10),
    };
    await saveBooks(books);
    revalidatePath('/books');
    revalidatePath('/');
  }
}

export async function deleteBook(id: string) {
  const books = await getBooks();
  const filtered = books.filter(b => b.id !== id);
  
  // Also need to remove from patron's checked out lists
  const patrons = await getPatrons();
  let patronUpdated = false;
  for (const patron of patrons) {
    if (patron.checkedOutBooks.includes(id)) {
      patron.checkedOutBooks = patron.checkedOutBooks.filter(bookId => bookId !== id);
      patronUpdated = true;
    }
  }
  
  await saveBooks(filtered);
  if (patronUpdated) {
    await savePatrons(patrons);
  }
  revalidatePath('/books');
  revalidatePath('/patrons');
  revalidatePath('/');
}

export async function addPatron(formData: FormData) {
  const patrons = await getPatrons();
  const newPatron: Patron = {
    id: Date.now().toString(),
    name: formData.get('name') as string,
    checkedOutBooks: [],
  };
  
  patrons.push(newPatron);
  await savePatrons(patrons);
  revalidatePath('/patrons');
  revalidatePath('/');
}

export async function updatePatron(id: string, formData: FormData) {
  const patrons = await getPatrons();
  const index = patrons.findIndex(p => p.id === id);
  if (index > -1) {
    patrons[index] = {
      ...patrons[index],
      name: formData.get('name') as string,
    };
    await savePatrons(patrons);
    revalidatePath('/patrons');
    revalidatePath('/');
  }
}

export async function deletePatron(id: string) {
  const patrons = await getPatrons();
  const index = patrons.findIndex(p => p.id === id);
  
  if (index > -1) {
    const patron = patrons[index];
    const books = await getBooks();
    let booksUpdated = false;
    
    // Return all books checked out by this patron
    for (const bookId of patron.checkedOutBooks) {
      const bookIndex = books.findIndex(b => b.id === bookId);
      if (bookIndex > -1) {
        books[bookIndex].status = 'Available';
        booksUpdated = true;
      }
    }
    
    patrons.splice(index, 1);
    await savePatrons(patrons);
    if (booksUpdated) {
      await saveBooks(books);
    }
    
    revalidatePath('/patrons');
    revalidatePath('/books');
    revalidatePath('/');
  }
}

export async function checkoutBook(formData: FormData) {
  const patronId = formData.get('patronId') as string;
  const bookId = formData.get('bookId') as string;

  if (!patronId || !bookId) throw new Error("Missing ID");

  const books = await getBooks();
  const patrons = await getPatrons();

  const bookIndex = books.findIndex(b => b.id === bookId);
  const patronIndex = patrons.findIndex(p => p.id === patronId);

  if (bookIndex > -1 && patronIndex > -1) {
    if (books[bookIndex].status !== 'Available') {
      throw new Error("Book is not available");
    }

    books[bookIndex].status = 'Checked Out';
    patrons[patronIndex].checkedOutBooks.push(bookId);

    await saveBooks(books);
    await savePatrons(patrons);

    revalidatePath('/books');
    revalidatePath('/patrons');
    revalidatePath('/operations');
    revalidatePath('/');
  }
}

export async function returnBook(formData: FormData) {
  const bookId = formData.get('bookId') as string;

  if (!bookId) throw new Error("Missing book ID");

  const books = await getBooks();
  const patrons = await getPatrons();

  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex > -1) {
    if (books[bookIndex].status === 'Available') {
      throw new Error("Book is already available");
    }

    books[bookIndex].status = 'Available';

    // Remove from whoever checked it out
    for (const patron of patrons) {
      if (patron.checkedOutBooks.includes(bookId)) {
        patron.checkedOutBooks = patron.checkedOutBooks.filter(id => id !== bookId);
      }
    }

    await saveBooks(books);
    await savePatrons(patrons);

    revalidatePath('/books');
    revalidatePath('/patrons');
    revalidatePath('/operations');
    revalidatePath('/');
  }
}
