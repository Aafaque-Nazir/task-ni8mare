import { getPatrons } from '@/lib/store';
import PatronManager from './PatronManager';

export const dynamic = 'force-dynamic';

export default async function PatronsPage() {
  const patrons = await getPatrons();

  return (
    <PatronManager initialPatrons={patrons} />
  );
}
