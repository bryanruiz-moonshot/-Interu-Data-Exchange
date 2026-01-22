import { Delivery, Assignee } from '../types';

const users: Record<string, Assignee> = {
  sarah: { id: 'u1', name: 'Sarah Miller', initials: 'SM', color: 'bg-amber-400', avatarUrl: 'https://i.pravatar.cc/150?u=sarah' },
  john: { id: 'u2', name: 'John Doe', initials: 'JD', color: 'bg-blue-400', avatarUrl: 'https://i.pravatar.cc/150?u=john' },
  diana: { id: 'u3', name: 'Diana Prince', initials: 'DP', color: 'bg-emerald-400', avatarUrl: 'https://i.pravatar.cc/150?u=diana' },
  marcus: { id: 'u4', name: 'Marcus Aurelius', initials: 'MA', color: 'bg-indigo-400', avatarUrl: 'https://i.pravatar.cc/150?u=marcus' },
  lee: { id: 'u5', name: 'Lee Chen', initials: 'LC', color: 'bg-rose-400', avatarUrl: 'https://i.pravatar.cc/150?u=lee' },
};

export const initialDeliveries: Delivery[] = [
  {
    id: 'DDS-001',
    sender: 'Global Supplies Co.',
    receiver: 'Innovate Inc.',
    records: [
      {
        id: '2QZQV7FNGL',
        name: 'Purchase Order PO-2025-0761',
        recordType: 'Purchase order',
        receivedDate: 'Nov 13, 2025',
        updates: null,
        exchange: null,
        documents: [{ id: 'doc-001', name: 'Invoice.pdf' }],
        orderDate: 'Nov 10, 2025',
        totalAmount: 15250.00,
        assignees: [users.sarah, users.john],
        lineItems: [
          { id: 'li-01', description: 'Model X-1 Processor', quantity: 100, unitPrice: 120.00 },
          { id: 'li-02', description: 'Model Y-3 RAM Module', quantity: 250, unitPrice: 13.00 },
        ]
      },
      {
        id: 'DEMO-2',
        name: 'Invoice INV-2025-1023',
        recordType: 'Purchase order',
        receivedDate: 'Nov 13, 2025',
        updates: null,
        exchange: null,
        documents: [{ id: 'doc-002', name: 'Invoice.pdf' }],
        orderDate: 'Nov 09, 2025',
        totalAmount: 8400.00,
        assignees: [users.diana],
        lineItems: [
          { id: 'li-03', description: 'Power Supply Unit 750W', quantity: 50, unitPrice: 168.00 },
        ]
      },
    ],
  },
  {
    id: 'DDS-002',
    sender: 'Global Supplies Co.',
    receiver: 'Innovate Inc.',
    records: [
      {
        id: 'BR_SUPPLY_CHAIN_TEST',
        name: 'Advance Ship Notice ASN-58220',
        recordType: 'Supply chain',
        receivedDate: 'Nov 07, 2025',
        updates: 1,
        exchange: 1,
        assignees: [users.marcus, users.lee],
        documents: [{ id: 'doc-003', name: 'Invoice.pdf' }],
      },
      {
        id: 'DELIVERY-SEND-AND-GET-BACK-TEST',
        name: 'Bill of Lading BOL-99A-482',
        recordType: 'Delivery',
        receivedDate: 'Aug 06, 2025',
        updates: null,
        exchange: null,
        assignees: [users.sarah],
        documents: [{ id: 'doc-004', name: 'Invoice.pdf' }],
        location: 'Port of Oakland, CA',
        products: [
            { id: 'prod-01', name: 'Industrial Grade Sensor', quantity: 500 },
            { id: 'prod-02', name: 'Mounting Bracket Kit', quantity: 500 },
        ]
      },
      {
        id: 'SEND-DDS-TEST-003',
        name: 'Packing Slip PS-88124-B',
        recordType: 'Delivery',
        receivedDate: 'Jul 24, 2025',
        updates: 3,
        exchange: null,
        assignees: [users.lee, users.john, users.marcus],
        documents: [{ id: 'doc-005', name: 'Invoice.pdf' }],
        location: 'In Transit - Pacific Ocean',
        products: [
            { id: 'prod-03', name: 'FPGA Development Board', quantity: 20 },
        ]
      },
    ],
  },
];