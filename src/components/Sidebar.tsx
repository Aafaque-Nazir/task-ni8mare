'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BookOpen, Users, Library, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Books', href: '/books', icon: BookOpen },
    { name: 'Patrons', href: '/patrons', icon: Users },
    { name: 'Operations', href: '/operations', icon: Library },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>
          <Library className="w-8 h-8 text-blue-500" />
          LibroSys
        </h1>
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      
      <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="premium-badge" style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Premium Edition</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Library Management System v1.0</p>
      </div>
    </aside>
  );
}
