'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/lib/store';
import { addBook, updateBook, deleteBook } from '@/lib/actions';
import { Plus, Search, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import PageWrapper from '@/components/PageWrapper';

export default function BookManager({ initialBooks }: { initialBooks: Book[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Filter books based on debounced search
  const filteredBooks = initialBooks.filter(b => 
    b.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    b.author.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    b.status.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingId) {
        await updateBook(editingId, formData);
      } else {
        await addBook(formData);
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error('Failed to save book:', error);
      alert('Failed to save book. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        startTransition(() => {
          router.refresh();
        });
      } catch (error) {
        console.error('Failed to delete book:', error);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  const openEdit = (book: Book) => {
    setEditingId(book.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const editingBook = initialBooks.find(b => b.id === editingId);

  return (
    <PageWrapper>
      <div>
        <div className="header-flex">
          <h2>Book Management</h2>
        <button className="btn btn-primary" onClick={openAdd} disabled={isPending}>
          <Plus className="w-5 h-5" /> Add Book
        </button>
      </div>

      <div className="search-bar">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by title, author, or status..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isPending && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
          <Loader2 className="w-4 h-4" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.875rem' }}>Updating...</span>
        </div>
      )}

      <div className="card-grid">
        {filteredBooks.map(book => (
          <div key={book.id} className="glass card">
            <div className="card-header">
              <div>
                <h3 className="card-title">{book.title}</h3>
                <p className="card-subtitle">by {book.author}</p>
              </div>
              <span className={`badge ${book.status === 'Available' ? 'available' : 'checked-out'}`}>
                {book.status}
              </span>
            </div>
            
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Published: {book.year}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-sm" 
                  style={{ background: 'rgba(234,179,8,0.1)', color: 'var(--primary-color)' }}
                  onClick={() => openEdit(book)}
                  disabled={isPending}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(book.id)}
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div className="glass card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p>No books found.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="glass modal">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  className="input-field" 
                  required 
                  defaultValue={editingBook?.title || ''}
                  key={editingId || 'new'}
                />
              </div>
              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input 
                  type="text" 
                  id="author" 
                  name="author" 
                  className="input-field" 
                  required 
                  defaultValue={editingBook?.author || ''}
                  key={`author-${editingId || 'new'}`}
                />
              </div>
              <div className="form-group">
                <label htmlFor="year">Year of Publication</label>
                <input 
                  type="number" 
                  id="year" 
                  name="year" 
                  className="input-field" 
                  required 
                  defaultValue={editingBook?.year || new Date().getFullYear()}
                  key={`year-${editingId || 'new'}`}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isPending}>
                  {isPending ? 'Saving...' : (editingId ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </PageWrapper>
  );
}
