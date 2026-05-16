'use server';

import { revalidatePath } from 'next/cache';
import { getBooks, saveBooks, getPatrons, savePatrons, Book, Patron } from './store';

export async function addBook(formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  const yearStr = formData.get('year') as string;

  if (!title || !author || !yearStr) {
    throw new Error('All fields are required');
  }

  const year = parseInt(yearStr, 10);
  if (isNaN(year)) {
    throw new Error('Invalid year');
  }

  const books = await getBooks();
  const newBook: Book = {
    id: Date.now().toString(),
    title: title.trim(),
    author: author.trim(),
    year,
    status: 'Available',
  };
  
  books.push(newBook);
  await saveBooks(books);
  revalidatePath('/books');
  revalidatePath('/');
}

export async function updateBook(id: string, formData: FormData) {
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;
  const yearStr = formData.get('year') as string;

  if (!title || !author || !yearStr) {
    throw new Error('All fields are required');
  }

  const year = parseInt(yearStr, 10);
  if (isNaN(year)) {
    throw new Error('Invalid year');
  }

  const books = await getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index > -1) {
    books[index] = {
      ...books[index],
      title: title.trim(),
      author: author.trim(),
      year,
    };
    await saveBooks(books);
    revalidatePath('/books');
    revalidatePath('/');
  } else {
    throw new Error('Book not found');
  }
}

export async function deleteBook(id: string) {
  const books = await getBooks();
  const filtered = books.filter(b => b.id !== id);
  
  if (filtered.length === books.length) {
    throw new Error('Book not found');
  }

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
  const name = formData.get('name') as string;

  if (!name) {
    throw new Error('Name is required');
  }

  const patrons = await getPatrons();
  const newPatron: Patron = {
    id: Date.now().toString(),
    name: name.trim(),
    checkedOutBooks: [],
  };
  
  patrons.push(newPatron);
  await savePatrons(patrons);
  revalidatePath('/patrons');
  revalidatePath('/');
}

export async function updatePatron(id: string, formData: FormData) {
  const name = formData.get('name') as string;

  if (!name) {
    throw new Error('Name is required');
  }

  const patrons = await getPatrons();
  const index = patrons.findIndex(p => p.id === id);
  if (index > -1) {
    patrons[index] = {
      ...patrons[index],
      name: name.trim(),
    };
    await savePatrons(patrons);
    revalidatePath('/patrons');
    revalidatePath('/');
  } else {
    throw new Error('Patron not found');
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
  } else {
    throw new Error('Patron not found');
  }
}

export async function checkoutBook(formData: FormData) {
  const patronId = formData.get('patronId') as string;
  const bookId = formData.get('bookId') as string;

  if (!patronId || !bookId) {
    throw new Error("Please select both a patron and a book");
  }

  const books = await getBooks();
  const patrons = await getPatrons();

  const bookIndex = books.findIndex(b => b.id === bookId);
  const patronIndex = patrons.findIndex(p => p.id === patronId);

  if (bookIndex === -1) {
    throw new Error("Book not found");
  }

  if (patronIndex === -1) {
    throw new Error("Patron not found");
  }

  if (books[bookIndex].status !== 'Available') {
    throw new Error("Book is not available for checkout");
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

export async function returnBook(formData: FormData) {
  const bookId = formData.get('bookId') as string;

  if (!bookId) {
    throw new Error("Please select a book to return");
  }

  const books = await getBooks();
  const patrons = await getPatrons();

  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) {
    throw new Error("Book not found");
  }

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
