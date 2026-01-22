
import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import BuyerDashboard from './components/BuyerDashboard';
import SupplierDashboard from './components/SupplierDashboard';
import Header from './components/Header';
import { UserRole } from './types';

const App: React.FC = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Receiver');

  return (
    <AppProvider>
      <div className="min-h-screen font-sans text-slate-800 bg-slate-100">
        <Header currentUserRole={currentUserRole} setCurrentUserRole={setCurrentUserRole} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {currentUserRole === 'Receiver' ? <BuyerDashboard /> : <SupplierDashboard />}
        </main>
      </div>
    </AppProvider>
  );
};

export default App;