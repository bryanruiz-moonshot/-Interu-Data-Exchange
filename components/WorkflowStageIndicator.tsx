
import React from 'react';
import { WorkflowStatus } from '../types';

interface WorkflowStageIndicatorProps {
  status: WorkflowStatus;
}

/**
 * Compact 3-Stage Stepper for Data Grids
 * 1. Review (Draft / In_Review)
 * 2. Adjustment (Changes_Requested)
 * 3. Done (Accepted)
 */
const WorkflowStageIndicator: React.FC<WorkflowStageIndicatorProps> = ({ status }) => {
  const getStageConfig = () => {
    switch (status) {
      case WorkflowStatus.Draft:
      case WorkflowStatus.In_Review:
        return { activeIndex: 0, label: 'Review', color: 'text-blue-600', dotColor: 'bg-blue-600' };
      case WorkflowStatus.Changes_Requested:
        return { activeIndex: 1, label: 'Adjustment', color: 'text-amber-600', dotColor: 'bg-amber-600' };
      case WorkflowStatus.Accepted:
        return { activeIndex: 2, label: 'Completed', color: 'text-[#559077]', dotColor: 'bg-[#559077]' };
      default:
        return { activeIndex: 0, label: 'Review', color: 'text-slate-500', dotColor: 'bg-slate-500' };
    }
  };

  const { activeIndex, label, color } = getStageConfig();
  const stages = [0, 1, 2];

  return (
    <div className="flex flex-col items-start w-fit group select-none">
      {/* Compact Stepper Track */}
      <div className="flex items-center mb-1 relative h-4">
        {stages.map((idx) => (
          <React.Fragment key={idx}>
            {/* The Stage Node */}
            <div className="relative flex items-center justify-center">
              {idx < activeIndex || (status === WorkflowStatus.Accepted && idx <= activeIndex) ? (
                /* COMPLETED STATE */
                <div className="w-2.5 h-2.5 rounded-full bg-[#559077] transition-all duration-300 shadow-sm" />
              ) : idx === activeIndex ? (
                /* ACTIVE STATE */
                <div className="relative flex items-center justify-center">
                   <div className={`absolute w-4 h-4 rounded-full ${status === WorkflowStatus.Changes_Requested ? 'bg-amber-100' : 'bg-blue-100'} animate-pulse`} />
                   <div className={`w-2.5 h-2.5 rounded-full border-2 ${status === WorkflowStatus.Changes_Requested ? 'border-amber-500' : 'border-blue-600'} bg-white transition-all duration-300`} />
                </div>
              ) : (
                /* PENDING STATE */
                <div className="w-2 h-2 rounded-full bg-slate-200 transition-all duration-300" />
              )}
            </div>

            {/* Fixed-width Connector Line (shorter for horizontal efficiency) */}
            {idx < stages.length - 1 && (
              <div className="w-4 h-[2px] mx-0.5 relative overflow-hidden bg-slate-100 rounded-full">
                <div 
                  className={`absolute inset-0 bg-[#559077] transition-transform duration-500 ease-in-out origin-left ${
                    idx < activeIndex || (status === WorkflowStatus.Accepted && idx < activeIndex) ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Minimal Label */}
      <span className={`text-[9px] font-black uppercase tracking-tighter ${color} transition-colors duration-300`}>
        {label}
      </span>
    </div>
  );
};

export default WorkflowStageIndicator;
