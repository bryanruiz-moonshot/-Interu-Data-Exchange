import React from 'react';
import { Assignee } from '../types';

interface AssigneeAvatarsProps {
  assignees?: Assignee[];
}

const AssigneeAvatars: React.FC<AssigneeAvatarsProps> = ({ assignees = [] }) => {
  if (assignees.length === 0) return <span className="text-xs text-slate-300 italic">Unassigned</span>;

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {assignees.map((assignee) => (
        <div 
          key={assignee.id} 
          className="relative group inline-block"
        >
          {assignee.avatarUrl ? (
            <img
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
              src={assignee.avatarUrl}
              alt={assignee.name}
            />
          ) : (
            <div className={`inline-block h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center ${assignee.color}`}>
              <span className="text-[10px] font-bold text-white uppercase">{assignee.initials}</span>
            </div>
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
            <div className="bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap">
              {assignee.name}
            </div>
            <div className="w-2 h-2 bg-slate-800 rotate-45 -mt-1 mx-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssigneeAvatars;