import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { Delivery, Record, Workflow, WorkflowStatus, Feedback, ReasonCode } from '../types';
import { initialDeliveries } from '../data/mockData';

interface AppContextType {
  deliveries: Delivery[];
  workflows: Workflow[];
  addFeedback: (workflowId: string, feedback: Omit<Feedback, 'id' | 'timestamp' | 'status' | 'authorRole'>, authorRole: 'Receiver' | 'Sender') => void;
  resolveFeedback: (workflowId: string, feedbackId: string) => void;
  updateWorkflowStatus: (workflowId: string, status: WorkflowStatus) => void;
  getWorkflowForRecord: (recordId: string) => Workflow | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deliveries] = useState<Delivery[]>(initialDeliveries);
  
  // Initialize workflows with varied timestamps for duration demo
  const [workflows, setWorkflows] = useState<Workflow[]>(() => 
    initialDeliveries.flatMap((d, dIdx) => d.records.map((r, rIdx) => {
      // Create some varied durations: 6 days ago, 1 hour ago, 15 mins ago
      let offset = 0;
      if (rIdx === 0) offset = 6 * 24 * 60 * 60 * 1000; // 6 days
      else if (rIdx === 1) offset = 1 * 60 * 60 * 1000; // 1 hour
      else offset = 15 * 60 * 1000; // 15 mins

      return {
        id: `wf-${r.id}`,
        targetId: r.id,
        targetType: r.recordType,
        status: WorkflowStatus.In_Review,
        feedbacks: [],
        lastStatusUpdate: new Date(Date.now() - offset).toISOString()
      };
    }))
  );

  const getWorkflowForRecord = useCallback((recordId: string) => {
    return workflows.find(wf => wf.targetId === recordId);
  }, [workflows]);

  const updateWorkflowStatus = useCallback((workflowId: string, status: WorkflowStatus) => {
    setWorkflows(prev => prev.map(wf => wf.id === workflowId ? { 
      ...wf, 
      status, 
      lastStatusUpdate: new Date().toISOString() 
    } : wf));
  }, []);

  const addFeedback = useCallback((
    workflowId: string, 
    feedback: Omit<Feedback, 'id' | 'timestamp' | 'status' | 'authorRole'>,
    authorRole: 'Receiver' | 'Sender'
  ) => {
    const newFeedback: Feedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'Open',
      authorRole
    };

    setWorkflows(prev => prev.map(wf => {
      if (wf.id === workflowId) {
        return {
          ...wf,
          feedbacks: [...wf.feedbacks, newFeedback]
        };
      }
      return wf;
    }));
  }, []);

  const resolveFeedback = useCallback((workflowId: string, feedbackId: string) => {
    setWorkflows(prev => prev.map(wf => {
      if (wf.id === workflowId) {
        const updatedFeedbacks = wf.feedbacks.map(fb => 
          fb.id === feedbackId ? { ...fb, status: 'Resolved' as const } : fb
        );
        return {
          ...wf,
          feedbacks: updatedFeedbacks
        };
      }
      return wf;
    }));
  }, []);

  const value = useMemo(() => ({
    deliveries,
    workflows,
    addFeedback,
    resolveFeedback,
    updateWorkflowStatus,
    getWorkflowForRecord
  }), [deliveries, workflows, addFeedback, resolveFeedback, updateWorkflowStatus, getWorkflowForRecord]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};