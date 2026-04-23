/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Portfolio } from './pages/Portfolio';
import { Gallery } from './pages/Gallery';
import { Achievements } from './pages/Achievements';
import { AdminDashboard } from './admin/AdminDashboard';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
      <BrowserRouter>
        <Toaster position="bottom-right" toastOptions={{ 
          className: 'bg-charcoal border border-white/10 text-white font-mono text-sm shadow-2xl skew-velocity',
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }} />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

