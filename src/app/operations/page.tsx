import { getBooks, getPatrons } from '@/lib/store';
import OperationsClient from './OperationsClient';

export const dynamic = 'force-dynamic';

export default async function OperationsPage() {
  const books = await getBooks();
  const patrons = await getPatrons();

  return (
    <OperationsClient books={books} patrons={patrons} />
  );
}
