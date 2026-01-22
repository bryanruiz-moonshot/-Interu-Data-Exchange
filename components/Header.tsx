
import React from 'react';
import { IconSupplyChain } from './Icons';
import { UserRole } from '../types';

interface HeaderProps {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUserRole, setCurrentUserRole }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
                <IconSupplyChain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Supply Chain Proto
            </h1>
          </div>
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setCurrentUserRole('Receiver')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentUserRole === 'Receiver'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Receiver
            </button>
            <button
              onClick={() => setCurrentUserRole('Sender')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentUserRole === 'Sender'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Sender
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;