import '../styles/globals.css';  // <-- Import Tailwind + global CSS
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { PaymentsProvider } from '../context/PaymentsContext';

// TopBar: global header present on all pages
// - shows brand name
// - provides quick Register link and theme toggle
function TopBar({ theme, toggleTheme }) {
  const [hasSeed, setHasSeed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ads_employees');
      const employees = raw ? JSON.parse(raw) : [];
      setHasSeed(employees.some((e) => e.email === 'janed@mail.com'));
    } catch (e) {
      setHasSeed(false);
    }
  }, []);

  const removeSeededEmployee = () => {
    try {
      const raw = localStorage.getItem('ads_employees');
      const employees = raw ? JSON.parse(raw) : [];
      const filtered = employees.filter((e) => e.email !== 'janed@mail.com');
      localStorage.setItem('ads_employees', JSON.stringify(filtered));
      setHasSeed(false);
      // optional: notify user
      alert('Demo employee removed');
    } catch (e) {
      // ignore
    }
  };

  return (
    <header className="w-full px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/" className="flex items-center no-underline">
          <span className="text-lg font-bold text-foreground">AdAstra Bank</span>
        </Link>
      </div>
      <div className="flex items-center space-x-3">
        {/* Link to the registration page */}
        {theme === 'dark' ? (
          <Link href="/register" className="px-3 py-1 rounded text-sm bg-accent text-on-accent">Register</Link>
        ) : (
          <Link href="/register" className="px-3 py-1 rounded text-sm" style={{backgroundColor:'#9ABD97', color:'#000'}}>Register</Link>
        )}
        {hasSeed && (
          <button onClick={removeSeededEmployee} className="px-3 py-1 rounded text-sm border" title="Remove demo employee">
            Remove Demo Employee
          </button>
        )}
        {/* Theme toggle - switches between light and dark modes */}
        <button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="p-2 rounded"
          style={{backgroundColor:'transparent'}}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-foreground" /> : <Moon className="h-5 w-5 text-foreground" />}
        </button>
      </div>
    </header>
  );
}

// Layout wraps all pages and injects the TopBar
function Layout({ children, theme, toggleTheme }) {
  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:'var(--bg)'}}>
      <TopBar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1">{children}</main>
    </div>
  );
}

// MyApp: Next.js custom App component
// - manages theme state (persisted to localStorage)
// - provides layout to pages
function MyApp({ Component, pageProps }) {
  const [theme, setTheme] = useState('light');

  // Load saved theme preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) setTheme(saved);
    } catch (e) {}

    // Ensure a default employee account exists for demos
    try {
      const raw = localStorage.getItem('ads_employees');
      const employees = raw ? JSON.parse(raw) : [];
      const exists = employees.find((e) => e.email === 'janed@mail.com');
      if (!exists) {
        employees.push({ email: 'janed@mail.com', password: 'Iamapassword1!', name: 'Jane Doe' });
        localStorage.setItem('ads_employees', JSON.stringify(employees));
      }
    } catch (e) {}
  }, []);

  // Apply/remove dark class on <html> and persist selection
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  // Toggle theme handler
  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <PaymentsProvider>
      <Layout theme={theme} toggleTheme={toggleTheme}>
        <Component {...pageProps} />
      </Layout>
    </PaymentsProvider>
  );
}

export default MyApp;
