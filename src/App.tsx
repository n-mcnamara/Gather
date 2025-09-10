import React from 'react';
import { NostrProvider } from './context/NostrProvider';
import AppContent from './AppContent';

export default function App() {
  return (
    <NostrProvider>
      <AppContent />
    </NostrProvider>
  );
}
