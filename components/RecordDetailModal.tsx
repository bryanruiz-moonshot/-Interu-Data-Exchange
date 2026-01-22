import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Record, WorkflowStatus, Feedback, ReasonCode, UserRole } from '../types';
import { IconX, IconActivity, IconCheckCircle, IconFlag, IconSend } from './Icons';
import { useAppContext } from '../contexts/AppContext';
import FeedbackAnchor from './FeedbackAnchor';

type ExpandedRecordType = Record & { sender: string; deliveryId: string; };

interface RecordDetailModalProps {
  record: ExpandedRecordType;
  onClose: () => void;
  userRole: UserRole;
}

const RecordDetailModal: React.FC<RecordDetailModalProps> = ({ record, onClose, userRole }) => {
    const { getWorkflowForRecord, addFeedback, updateWorkflowStatus, resolveFeedback } = useAppContext();
    const [isShowing, setIsShowing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const workflow = getWorkflowForRecord(record.id);

    const [activeAnchorId, setActiveAnchorId] = useState<string | null>(null);

    const tabs = useMemo(() => {
        if (record.recordType === 'Delivery') return ['Details', 'Products'];
        if (record.recordType === 'Purchase order') return ['Details', 'Line Items'];
        return ['Details'];
    }, [record.recordType]);

    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [highlightedComponent, setHighlightedComponent] = useState<string | null>(null);

    /**
     * STRICT GOVERNANCE LOGIC ("Who Has The Ball")
     * Receiver holds the ball while in 'In Review'.
     * Sender holds the ball while in 'Changes Requested' or 'Draft'.
     */
    const hasTheBall = useMemo(() => {
      if (!workflow) return false;
      if (workflow.status === WorkflowStatus.Accepted) return false;
      
      if (userRole === 'Receiver') {
        return workflow.status === WorkflowStatus.In_Review;
      } else {
        return workflow.status === WorkflowStatus.Changes_Requested || workflow.status === WorkflowStatus.Draft;
      }
    }, [workflow, userRole]);

    const isReadOnly = !hasTheBall;

    const openFeedbackCount = useMemo(() => 
      workflow?.feedbacks.filter(f => f.status === 'Open').length || 0
    , [workflow]);

    useEffect(() => {
        const modalTimer = setTimeout(() => setIsShowing(true), 50);
        return () => clearTimeout(modalTimer);
    }, []);

    const handleClose = () => {
        setIsShowing(false);
        setTimeout(onClose, 300);
    }

    const handleNavigateToFeedback = (fb: Feedback) => {
      setActiveTab(fb.tabName);
      setHighlightedComponent(fb.componentId);
      setTimeout(() => setHighlightedComponent(null), 3000);
    };

    const isFieldFlagged = (componentId: string) => 
      workflow?.feedbacks.some(fb => fb.componentId === componentId && fb.status === 'Open');

    const renderDetailField = (label: string, value: string | number | undefined, componentId: string) => (
      <div 
        className={`flex justify-between items-center group p-3 rounded-xl transition-all border border-transparent ${
          highlightedComponent === componentId 
            ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' 
            : isFieldFlagged(componentId) 
              ? 'bg-red-50 border-red-100' 
              : 'hover:bg-slate-50'
        }`}
      >
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
          <div className={`text-sm font-semibold transition-colors ${isReadOnly ? 'text-slate-500' : 'text-slate-800'}`}>
            {value ?? '-'}
          </div>
        </div>
        <FeedbackAnchor 
          componentId={componentId}
          tabName="Details"
          isFlagged={isFieldFlagged(componentId)}
          currentUserRole={userRole}
          isReadOnly={isReadOnly}
          isOpen={activeAnchorId === componentId}
          onToggle={() => setActiveAnchorId(activeAnchorId === componentId ? null : componentId)}
          onAddFeedback={(reason, comment) => {
            if (workflow) addFeedback(workflow.id, { componentId, tabName: 'Details', reasonCode: reason, comment }, userRole);
            setActiveAnchorId(null);
          }}
        />
      </div>
    );

    const renderActivityFeed = () => (
      <div className="w-80 border-l border-slate-200 bg-slate-50 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center space-x-2">
            <IconActivity className="w-4 h-4 text-slate-600" />
            <h4 className="text-sm font-bold text-slate-700">Audit Trail & Feedback</h4>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {workflow?.feedbacks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
               <IconFlag className="w-8 h-8 text-slate-200 mb-2" />
               <p className="text-xs text-slate-400 max-w-[160px]">Awaiting feedback or validation activity.</p>
            </div>
          ) : (
            workflow?.feedbacks.map(fb => (
              <div 
                key={fb.id} 
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                  fb.status === 'Resolved' ? 'bg-green-50 border-green-100' : 'bg-white border-slate-200'
                }`}
                onClick={() => handleNavigateToFeedback(fb)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-black uppercase tracking-tighter ${fb.status === 'Resolved' ? 'text-green-700' : 'text-red-600'}`}>
                    {fb.reasonCode}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {new Date(fb.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 mb-3 leading-relaxed">{fb.comment}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 uppercase font-black">{fb.tabName}</span>
                  {fb.status === 'Open' && userRole === 'Sender' && hasTheBall && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); resolveFeedback(workflow.id, fb.id); }}
                      className="text-[10px] text-blue-600 font-black hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                    >
                      MARK FIXED
                    </button>
                  )}
                  {fb.status === 'Resolved' && (
                    <div className="flex items-center text-green-600 space-x-1">
                      <IconCheckCircle className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">FIXED</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );

    return (
        <div className="fixed inset-0 z-30 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isShowing ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}></div>

            <div className={`relative h-[90vh] w-[95vw] max-w-5xl bg-white shadow-2xl rounded-3xl flex transition-all duration-500 ease-out overflow-hidden ${isShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                
                {/* Main Content Area */}
                <div className="flex-grow flex flex-col h-full overflow-hidden">
                    {/* Status Bar / Governance Banner */}
                    <div className={`p-2.5 flex justify-between items-center px-6 shrink-0 transition-colors duration-500 ${
                      workflow?.status === WorkflowStatus.Accepted ? 'bg-green-600' :
                      hasTheBall ? 'bg-blue-600' : 'bg-slate-800'
                    }`}>
                       <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Status</span>
                            <span className="text-xs font-black text-white">{workflow?.status.toUpperCase()}</span>
                          </div>
                          
                          <div className="h-4 w-px bg-white/20"></div>

                          <div className="flex items-center space-x-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Ownership</span>
                            <div className="flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
                              <div className={`w-2 h-2 rounded-full ${hasTheBall ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></div>
                              <span className="text-[11px] font-black text-white">
                                {hasTheBall ? 'YOUR TURN' : workflow?.status === WorkflowStatus.Accepted ? 'CLOSED' : 'WAITING FOR COUNTERPARTY'}
                              </span>
                            </div>
                          </div>
                       </div>
                       
                       {isReadOnly && workflow?.status !== WorkflowStatus.Accepted && (
                         <div className="text-[10px] font-black text-white/80 animate-pulse flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            <span>READ ONLY MODE</span>
                         </div>
                       )}
                    </div>

                    {/* Header */}
                    <div className="p-8 pb-4 shrink-0">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                  <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-black text-slate-400 tracking-tighter">{record.id}</span>
                                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{record.recordType}</span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{record.name}</h3>
                            </div>
                            <button onClick={handleClose} className="p-2 rounded-full text-slate-300 hover:bg-slate-100 hover:text-slate-600 transition-all">
                                <IconX className="w-8 h-8" />
                            </button>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="px-8 shrink-0 bg-white">
                        <nav className="flex space-x-1 border-b border-slate-100">
                            {tabs.map(tab => (
                                <button 
                                    key={tab} 
                                    onClick={() => {
                                      setActiveTab(tab);
                                      setActiveAnchorId(null);
                                    }}
                                    className={`whitespace-nowrap pb-4 px-4 font-black text-xs uppercase tracking-widest transition-all relative ${
                                      activeTab === tab 
                                        ? 'text-blue-600' 
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className={`flex-grow p-8 overflow-y-auto transition-opacity duration-300 ${isReadOnly ? 'opacity-80 grayscale-[0.3]' : 'opacity-100'}`} ref={scrollRef}>
                      {activeTab === 'Details' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                          {renderDetailField("Sender", record.sender, "field_sender")}
                          {renderDetailField("Received Date", record.receivedDate, "field_received_date")}
                          {record.location && renderDetailField("Location", record.location, "field_location")}
                          {record.orderDate && renderDetailField("Order Date", record.orderDate, "field_order_date")}
                          {record.totalAmount && renderDetailField("Total Amount", `$${record.totalAmount.toLocaleString()}`, "field_total_amount")}
                        </div>
                      )}

                      {activeTab === 'Line Items' && (
                        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Description</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Qty</th>
                                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Price</th>
                                <th className="p-4 w-12"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {record.lineItems?.map(item => (
                                <tr 
                                  key={item.id} 
                                  className={`group transition-all ${
                                    highlightedComponent === `row_${item.id}` ? 'bg-blue-50' : isFieldFlagged(`row_${item.id}`) ? 'bg-red-50' : 'hover:bg-slate-50'
                                  }`}
                                >
                                  <td className="p-4">
                                    <div className="font-bold text-slate-800">{item.description}</div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-1">{item.id}</div>
                                  </td>
                                  <td className="p-4 text-right font-semibold text-slate-600">{item.quantity}</td>
                                  <td className="p-4 text-right font-black text-slate-800">${item.unitPrice.toFixed(2)}</td>
                                  <td className="p-4">
                                    <FeedbackAnchor 
                                      componentId={`row_${item.id}`}
                                      tabName="Line Items"
                                      recordDataId={item.id}
                                      isFlagged={isFieldFlagged(`row_${item.id}`)}
                                      currentUserRole={userRole}
                                      isReadOnly={isReadOnly}
                                      isOpen={activeAnchorId === `row_${item.id}`}
                                      onToggle={() => setActiveAnchorId(activeAnchorId === `row_${item.id}` ? null : `row_${item.id}`)}
                                      onAddFeedback={(reason, comment) => {
                                        if (workflow) addFeedback(workflow.id, { componentId: `row_${item.id}`, tabName: 'Line Items', recordDataId: item.id, reasonCode: reason, comment }, userRole);
                                        setActiveAnchorId(null);
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Modal Footer Actions */}
                    <div className="p-8 border-t border-slate-100 bg-slate-50/50 shrink-0 flex justify-end items-center space-x-4">
                       {!hasTheBall && workflow?.status !== WorkflowStatus.Accepted && (
                         <div className="flex items-center space-x-3 text-slate-400 bg-slate-100 px-4 py-2 rounded-full">
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                           <span className="text-[10px] font-black uppercase tracking-widest">Action Locked — Awaiting Counterparty</span>
                         </div>
                       )}

                       {userRole === 'Receiver' && hasTheBall && (
                         <>
                           {openFeedbackCount > 0 && (
                             <button 
                                onClick={() => updateWorkflowStatus(workflow.id, WorkflowStatus.Changes_Requested)}
                                className="bg-red-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center shadow-xl shadow-red-100"
                              >
                                <IconFlag className="w-4 h-4 mr-3" />
                                Submit {openFeedbackCount} Change Request{openFeedbackCount > 1 ? 's' : ''}
                              </button>
                           )}
                           
                           <button 
                              onClick={() => updateWorkflowStatus(workflow.id, WorkflowStatus.Accepted)}
                              className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center shadow-xl ${
                                openFeedbackCount > 0 
                                  ? 'bg-white text-slate-400 border border-slate-200 hover:text-slate-600'
                                  : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95 shadow-green-100'
                              }`}
                            >
                              <IconCheckCircle className="w-4 h-4 mr-3" />
                              Accept All Records
                            </button>
                         </>
                       )}

                       {userRole === 'Sender' && hasTheBall && (
                         <button 
                            onClick={() => updateWorkflowStatus(workflow.id, WorkflowStatus.In_Review)}
                            className="bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center shadow-xl shadow-blue-100"
                          >
                            <IconSend className="w-4 h-4 mr-3" />
                            Submit Revisions
                          </button>
                       )}
                    </div>
                </div>

                {/* Right Activity Sidebar */}
                {renderActivityFeed()}
            </div>
        </div>
    );
};

export default RecordDetailModal;