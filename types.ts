export enum WorkflowStatus {
  Draft = 'Draft',
  In_Review = 'In Review',
  Changes_Requested = 'Changes Requested',
  Accepted = 'Accepted',
}

export type EntityType = 'Purchase order' | 'Delivery' | 'Supply chain';

export enum ReasonCode {
  DataMismatch = 'Data Mismatch',
  MissingFile = 'Missing File',
  QualityIssue = 'Quality Issue',
  IncorrectQuantity = 'Incorrect Quantity',
  Other = 'Other',
}

export interface Feedback {
  id: string;
  componentId: string;
  tabName: string;
  recordDataId?: string; // e.g. a specific product ID
  reasonCode: ReasonCode;
  comment: string;
  status: 'Open' | 'Resolved';
  authorRole: 'Receiver' | 'Sender';
  timestamp: string;
}

export interface Workflow {
  id: string;
  targetId: string;
  targetType: EntityType;
  status: WorkflowStatus;
  feedbacks: Feedback[];
  lastStatusUpdate: string; // ISO timestamp
}

export interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  color: string;
}

export interface AttachedDocument {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Record {
  id: string;
  name: string;
  recordType: EntityType;
  receivedDate: string;
  updates: number | null;
  exchange: number | null;
  documents: AttachedDocument[];
  location?: string;
  products?: Product[];
  orderDate?: string;
  totalAmount?: number;
  lineItems?: LineItem[];
  assignees?: Assignee[];
}

export interface Delivery {
  id: string;
  sender: string;
  receiver: string;
  records: Record[];
}

export type UserRole = 'Receiver' | 'Sender';