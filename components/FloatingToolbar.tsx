import React from 'react';
import { IconHighlight, IconSquiggle } from './Icons';

export type Mode = 'review' | 'edit';

interface FloatingToolbarProps {
    activeMode: Mode;
    onModeChange: (mode: Mode) => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ activeMode, onModeChange }) => {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center space-x-2 bg-white rounded-full shadow-lg p-2 border border-slate-200">
                <div className="relative">
                    <select
                        value={activeMode}
                        onChange={(e) => onModeChange(e.target.value as Mode)}
                        className="appearance-none bg-lime-100 text-lime-800 font-semibold rounded-full pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lime-400 cursor-pointer"
                    >
                        <option value="review">Review mode</option>
                        <option value="edit">Edit mode</option>
                    </select>
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-lime-500 rounded-full pointer-events-none"></div>
                    <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                <button className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors" title="Add Highlight (coming soon)">
                   <IconHighlight className="w-6 h-6" />
                </button>
                 <button className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors" title="Add Comment (coming soon)">
                    <IconSquiggle className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default FloatingToolbar;