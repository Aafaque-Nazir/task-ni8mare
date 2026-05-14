import { getBooks, getPatrons } from '@/lib/store';
import { Book, Users, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const books = await getBooks();
  const patrons = await getPatrons();

  const totalBooks = books.length;
  const availableBooks = books.filter(b => b.status === 'Available').length;
  const checkedOutBooks = totalBooks - availableBooks;
  const totalPatrons = patrons.length;

  return (
    <PageWrapper>
      <div>
        <h2>Dashboard Overview</h2>
      
      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass stat-card">
          <div className="stat-icon">
            <Book className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <h3>Total Books</h3>
            <p>{totalBooks}</p>
          </div>
        </div>

        <div className="glass stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-primary)' }}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <h3>Available Books</h3>
            <p>{availableBooks}</p>
          </div>
        </div>

        <div className="glass stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)' }}>
            <Clock className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <h3>Checked Out</h3>
            <p>{checkedOutBooks}</p>
          </div>
        </div>

        <div className="glass stat-card">
          <div className="stat-icon" style={{ background: 'rgba(234, 179, 8, 0.2)', color: 'var(--primary-color)' }}>
            <Users className="w-6 h-6" />
          </div>
          <div className="stat-content">
            <h3>Total Patrons</h3>
            <p>{totalPatrons}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/books" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
              <Book className="w-5 h-5" /> Manage Books
            </Link>
            <Link href="/patrons" className="btn btn-primary" style={{ justifyContent: 'flex-start', background: '#333', color: '#fff', boxShadow: 'none' }}>
              <Users className="w-5 h-5" /> Manage Patrons
            </Link>
            <Link href="/operations" className="btn btn-primary" style={{ justifyContent: 'flex-start', background: '#fff', color: '#000', boxShadow: 'none' }}>
              <Clock className="w-5 h-5" /> Checkout / Return
            </Link>
          </div>
        </div>

        <div className="glass card">
          <div className="card-header">
            <h3 className="card-title">Recent Books</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {books.slice(-4).reverse().map(book => (
              <div key={book.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem' }}>
                <div>
                  <h4 style={{ fontWeight: 600 }}>{book.title}</h4>
                  <p style={{ fontSize: '0.875rem' }}>{book.author}</p>
                </div>
                <span className={`badge ${book.status === 'Available' ? 'available' : 'checked-out'}`}>
                  {book.status}
                </span>
              </div>
            ))}
            {books.length === 0 && (
              <p style={{ textAlign: 'center', padding: '1rem' }}>No books added yet.</p>
            )}
          </div>
        </div>
      </div>
      </div>
    </PageWrapper>
  );
}
