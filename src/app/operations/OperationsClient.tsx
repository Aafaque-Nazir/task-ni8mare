'use client';

import { useState } from 'react';
import { Book, Patron } from '@/lib/store';
import { checkoutBook, returnBook } from '@/lib/actions';
import { BookOpen, UserCheck, RefreshCw } from 'lucide-react';

export default function OperationsClient({ 
  books, 
  patrons 
}: { 
  books: Book[], 
  patrons: Patron[] 
}) {
  const [checkoutError, setCheckoutError] = useState('');
  const [returnError, setReturnError] = useState('');

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckoutError('');
    const formData = new FormData(e.currentTarget);
    try {
      await checkoutBook(formData);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setCheckoutError(err.message || 'Failed to checkout book');
    }
  };

  const handleReturn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReturnError('');
    const formData = new FormData(e.currentTarget);
    try {
      await returnBook(formData);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setReturnError(err.message || 'Failed to return book');
    }
  };

  const availableBooks = books.filter(b => b.status === 'Available');
  const checkedOutBooks = books.filter(b => b.status === 'Checked Out');

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Library Operations</h2>

      <div className="operations-grid">
        
        {/* Checkout Section */}
        <div className="glass card">
          <div className="card-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen className="w-6 h-6 text-blue-500" />
              Checkout Book
            </h3>
          </div>
          
          <form onSubmit={handleCheckout}>
            <div className="form-group">
              <label htmlFor="patronId">Select Patron</label>
              <select name="patronId" id="patronId" className="input-field" required>
                <option value="">-- Choose a Patron --</option>
                {patrons.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bookId">Select Book</label>
              <select name="bookId" id="bookId" className="input-field" required>
                <option value="">-- Choose an Available Book --</option>
                {availableBooks.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.title} by {b.author}
                  </option>
                ))}
              </select>
            </div>

            {checkoutError && (
              <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {checkoutError}
              </p>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={availableBooks.length === 0 || patrons.length === 0}>
              <UserCheck className="w-5 h-5" /> Checkout
            </button>

            {availableBooks.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                No books available to checkout.
              </p>
            )}
            {patrons.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Please add patrons first.
              </p>
            )}
          </form>
        </div>

        {/* Return Section */}
        <div className="glass card">
          <div className="card-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw className="w-6 h-6 text-green-500" />
              Return Book
            </h3>
          </div>
          
          <form onSubmit={handleReturn}>
            <div className="form-group">
              <label htmlFor="returnBookId">Select Book to Return</label>
              <select name="bookId" id="returnBookId" className="input-field" required>
                <option value="">-- Choose a Checked Out Book --</option>
                {checkedOutBooks.map(b => {
                  // Find the patron who checked it out
                  const patron = patrons.find(p => p.checkedOutBooks.includes(b.id));
                  return (
                    <option key={b.id} value={b.id}>
                      {b.title} (Checked out by: {patron ? patron.name : 'Unknown'})
                    </option>
                  );
                })}
              </select>
            </div>

            {returnError && (
              <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {returnError}
              </p>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, #10b981, #047857)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }} disabled={checkedOutBooks.length === 0}>
              <RefreshCw className="w-5 h-5" /> Return Book
            </button>

            {checkedOutBooks.length === 0 && (
              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
                No books currently checked out.
              </p>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}
