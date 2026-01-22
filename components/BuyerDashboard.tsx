
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Record as RecordType, WorkflowStatus } from '../types';
import { IconSearch } from './Icons';
import RecordDetailModal from './RecordDetailModal';
import WorkflowStageIndicator from './WorkflowStageIndicator';
import AssigneeAvatars from './AssigneeAvatars';

type ExpandedRecordType = RecordType & { sender: string; deliveryId: string; };

const formatDuration = (isoString: string) => {
  const start = new Date(isoString).getTime();
  const now = Date.now();
  const diffInMs = now - start;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) return `${diffInDays}d`;
  if (diffInHours > 0) return `${diffInHours}h`;
  return `${diffInMins}m`;
};

const BuyerDashboard: React.FC = () => {
  const { deliveries, getWorkflowForRecord } = useAppContext();
  const [selectedRecord, setSelectedRecord] = useState<ExpandedRecordType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const allRecords = useMemo(() => deliveries.flatMap(delivery => 
    delivery.records.map(record => ({
        ...record,
        sender: delivery.sender,
        deliveryId: delivery.id
    }))
  ), [deliveries]);

  const filteredRecords = useMemo(() => allRecords.filter(record => 
    record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.sender.toLowerCase().includes(searchQuery.toLowerCase())
  ), [allRecords, searchQuery]);

  return (
    <>
    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Operations Control</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Supply Chain Inbox</h2>
          <p className="text-slate-400 mt-2 font-medium max-w-lg">Centralized governance for inbound records. Review, flag, and approve shipment data with cryptographic certainty.</p>
        </div>
        <div className="relative group">
          <IconSearch className="w-5 h-5 text-slate-300 absolute top-1/2 left-4 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search record name or sender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-96 pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-200 transition-all outline-none"
          />
        </div>
      </div>
      
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <th className="p-6 border-b border-slate-100">Record Identity</th>
              <th className="p-6 border-b border-slate-100">Sender Entity</th>
              <th className="p-6 border-b border-slate-100">Turn</th>
              <th className="p-6 border-b border-slate-100">Workflow Stage</th>
              <th className="p-6 border-b border-slate-100">Governance</th>
              <th className="p-6 border-b border-slate-100 text-right">Review</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRecords.map((record) => {
              const workflow = getWorkflowForRecord(record.id);
              const isYourTurn = workflow?.status === WorkflowStatus.In_Review;
              const duration = workflow ? formatDuration(workflow.lastStatusUpdate) : '0m';
              
              return (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="p-6">
                    <div className="font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">{record.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1 font-medium">{record.id}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center space-x-2">
                       <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">GS</div>
                       <span className="font-bold text-slate-600 tracking-tight">{record.sender}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    {workflow?.status === WorkflowStatus.Accepted ? (
                      <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">Closed</span>
                    ) : isYourTurn ? (
                      <div className="flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full w-fit border border-blue-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">You</span>
                        <span className="text-[10px] font-black opacity-40 ml-1">• {duration}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-400 px-3 py-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sender</span>
                        <span className="text-[10px] font-black opacity-30 ml-1">• {duration}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-6">
                    <WorkflowStageIndicator status={workflow?.status || WorkflowStatus.Draft} />
                  </td>
                  <td className="p-6">
                    <AssigneeAvatars assignees={record.assignees} />
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => setSelectedRecord(record)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border ${
                        isYourTurn 
                          ? 'bg-slate-900 text-white border-slate-900 hover:bg-blue-600 hover:border-blue-600 shadow-blue-100 hover:scale-105 active:scale-95' 
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isYourTurn ? 'Review Record' : 'View Only'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    {selectedRecord && (
        <RecordDetailModal 
            record={selectedRecord} 
            onClose={() => setSelectedRecord(null)}
            userRole="Receiver"
        />
    )}
    </>
  );
};

export default BuyerDashboard;
