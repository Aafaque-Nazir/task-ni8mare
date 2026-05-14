import { getBooks } from '@/lib/store';
import BookManager from './BookManager';

export const dynamic = 'force-dynamic';

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <BookManager initialBooks={books} />
  );
}
