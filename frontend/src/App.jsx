import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast Notification Container with Design.md Styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1E293B',
            color: '#FFFFFF',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid #334155',
            boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.1)'
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF'
            }
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF'
            }
          }
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}
