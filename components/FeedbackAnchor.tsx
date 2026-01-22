import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconFlag, IconMessage, IconX } from './Icons';
import { ReasonCode, UserRole } from '../types';

interface FeedbackAnchorProps {
  componentId: string;
  tabName: string;
  recordDataId?: string;
  isFlagged: boolean;
  currentUserRole: UserRole;
  isReadOnly: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onAddFeedback: (reason: ReasonCode, comment: string) => void;
  className?: string;
}

const FeedbackAnchor: React.FC<FeedbackAnchorProps> = ({
  componentId,
  tabName,
  isFlagged,
  currentUserRole,
  isReadOnly,
  isOpen,
  onToggle,
  onAddFeedback,
  className = ""
}) => {
  const [reason, setReason] = useState<ReasonCode>(ReasonCode.DataMismatch);
  const [comment, setComment] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  // Update positioning relative to viewport when opened
  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left + rect.width / 2
      });
    }
  }, [isOpen]);

  if (isReadOnly && !isFlagged) return null;

  const Popover = (
    <>
      {/* Semi-transparent backdrop to capture click-outside and darken rest of UI */}
      <div 
        className="fixed inset-0 z-[90] bg-transparent cursor-default" 
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      />
      
      {/* The actual popover anchored to the button's viewport position */}
      <div 
        className="fixed z-[100] w-64 bg-white rounded-lg shadow-2xl border border-slate-200 p-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-2"
        style={{
          top: `${coords.top - 10}px`, // Slight gap from button
          left: `${coords.left}px`,
          transform: 'translate(-50%, -100%)' // Center horizontally, place above
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-bold text-slate-700">Flag for Revision</h4>
          <button onClick={onToggle} className="p-1 hover:bg-slate-100 rounded">
            <IconX className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Reason Code</label>
            <select 
              className="w-full text-sm border border-slate-300 rounded p-1.5 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={reason}
              onChange={e => setReason(e.target.value as ReasonCode)}
            >
              {Object.values(ReasonCode).map(rc => (
                <option key={rc} value={rc}>{rc}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Comment</label>
            <textarea 
              className="w-full text-sm border border-slate-300 rounded p-1.5 h-20 resize-none focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Explain the discrepancy..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              autoFocus
            />
          </div>
          <button 
            onClick={() => {
              onAddFeedback(reason, comment);
              setComment("");
            }}
            className="w-full bg-blue-600 text-white text-xs font-bold py-2.5 rounded shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Confirm Flag
          </button>
        </div>

        {/* Pointer Triangle */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
      </div>
    </>
  );

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`p-1.5 rounded-full transition-all ${
          isFlagged 
            ? 'bg-red-100 text-red-600 ring-2 ring-red-50' 
            : isOpen
              ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-50'
              : 'text-slate-300 hover:text-blue-500 hover:bg-blue-50'
        } ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}`}
        disabled={isReadOnly && !isFlagged}
      >
        {isFlagged ? (
          <IconFlag className="w-4 h-4" />
        ) : (
          <IconMessage className={`w-4 h-4 ${isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
        )}
      </button>

      {isOpen && !isReadOnly && createPortal(Popover, document.body)}
    </div>
  );
};

export default FeedbackAnchor;