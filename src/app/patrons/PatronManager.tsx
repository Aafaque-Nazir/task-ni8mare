'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Patron } from '@/lib/store';
import { addPatron, updatePatron, deletePatron } from '@/lib/actions';
import { Plus, Search, Edit2, Trash2, X, User, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import PageWrapper from '@/components/PageWrapper';

export default function PatronManager({ initialPatrons }: { initialPatrons: Patron[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredPatrons = initialPatrons.filter(p => 
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingId) {
        await updatePatron(editingId, formData);
      } else {
        await addPatron(formData);
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error('Failed to save patron:', error);
      alert('Failed to save patron. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this patron? All checked out books will be returned.')) {
      try {
        await deletePatron(id);
        startTransition(() => {
          router.refresh();
        });
      } catch (error) {
        console.error('Failed to delete patron:', error);
        alert('Failed to delete patron. Please try again.');
      }
    }
  };

  const openEdit = (patron: Patron) => {
    setEditingId(patron.id);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setIsModalOpen(true);
  };

  const editingPatron = initialPatrons.find(p => p.id === editingId);

  return (
    <PageWrapper>
      <div>
        <div className="header-flex">
          <h2>Patron Management</h2>
        <button className="btn btn-primary" onClick={openAdd} disabled={isPending}>
          <Plus className="w-5 h-5" /> Add Patron
        </button>
      </div>

      <div className="search-bar">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by name or ID..." 
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
        {filteredPatrons.map(patron => (
          <div key={patron.id} className="glass card">
            <div className="card-header" style={{ alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="card-title">{patron.name}</h3>
                  <p className="card-subtitle">ID: {patron.id}</p>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Books Checked Out: <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{patron.checkedOutBooks.length}</span>
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-sm" 
                  style={{ background: 'rgba(234,179,8,0.1)', color: 'var(--primary-color)' }}
                  onClick={() => openEdit(patron)}
                  disabled={isPending}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(patron.id)}
                  disabled={isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredPatrons.length === 0 && (
          <div className="glass card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <p>No patrons found.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="glass modal">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Patron' : 'Add New Patron'}</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="input-field" 
                  required 
                  defaultValue={editingPatron?.name || ''}
                  key={editingId || 'new'}
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
