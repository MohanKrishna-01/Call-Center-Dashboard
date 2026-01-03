import { CallRecord } from './types';

// Helper to generate random date within last 7 days
const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 7));
  return date.toISOString().split('T')[0];
};

export const MOCK_CALL_DATA: CallRecord[] = [
  { id: 'C1001', agentName: 'Sarah Conner', department: 'Technical', topic: 'Login Issue', date: getRandomDate(), time: '09:15', answered: true, resolved: true, speedOfAnswer: 12, duration: 5.5, satisfactionRating: 5 },
  { id: 'C1002', agentName: 'John Smith', department: 'Billing', topic: 'Payment Failure', date: getRandomDate(), time: '09:22', answered: true, resolved: false, speedOfAnswer: 45, duration: 8.2, satisfactionRating: 3 },
  { id: 'C1003', agentName: 'Emily Davis', department: 'Sales', topic: 'New Subscription', date: getRandomDate(), time: '09:45', answered: true, resolved: true, speedOfAnswer: 8, duration: 12.0, satisfactionRating: 5 },
  { id: 'C1004', agentName: 'Sarah Conner', department: 'Technical', topic: 'System Crash', date: getRandomDate(), time: '10:05', answered: true, resolved: true, speedOfAnswer: 15, duration: 15.5, satisfactionRating: 4 },
  { id: 'C1005', agentName: 'Mike Ross', department: 'Billing', topic: 'Refund Request', date: getRandomDate(), time: '10:12', answered: true, resolved: true, speedOfAnswer: 30, duration: 4.5, satisfactionRating: 4 },
  { id: 'C1006', agentName: 'John Smith', department: 'Billing', topic: 'Invoice Inquiry', date: getRandomDate(), time: '10:30', answered: false, resolved: false, speedOfAnswer: 0, duration: 0, satisfactionRating: 0 },
  { id: 'C1007', agentName: 'Emily Davis', department: 'Sales', topic: 'Upgrade Plan', date: getRandomDate(), time: '11:00', answered: true, resolved: true, speedOfAnswer: 10, duration: 9.5, satisfactionRating: 5 },
  { id: 'C1008', agentName: 'Sarah Conner', department: 'Technical', topic: 'Login Issue', date: getRandomDate(), time: '11:15', answered: true, resolved: true, speedOfAnswer: 20, duration: 3.2, satisfactionRating: 5 },
  { id: 'C1009', agentName: 'Mike Ross', department: 'Billing', topic: 'Payment Failure', date: getRandomDate(), time: '11:45', answered: true, resolved: false, speedOfAnswer: 55, duration: 10.0, satisfactionRating: 2 },
  { id: 'C1010', agentName: 'Jessica Pearson', department: 'Admin', topic: 'Account Closure', date: getRandomDate(), time: '12:00', answered: true, resolved: true, speedOfAnswer: 25, duration: 6.0, satisfactionRating: 3 },
  { id: 'C1011', agentName: 'Sarah Conner', department: 'Technical', topic: 'Hardware Issue', date: getRandomDate(), time: '12:30', answered: true, resolved: true, speedOfAnswer: 18, duration: 20.5, satisfactionRating: 4 },
  { id: 'C1012', agentName: 'John Smith', department: 'Billing', topic: 'Refund Request', date: getRandomDate(), time: '13:00', answered: true, resolved: true, speedOfAnswer: 35, duration: 5.0, satisfactionRating: 4 },
  { id: 'C1013', agentName: 'Emily Davis', department: 'Sales', topic: 'New Subscription', date: getRandomDate(), time: '13:15', answered: true, resolved: true, speedOfAnswer: 5, duration: 11.2, satisfactionRating: 5 },
  { id: 'C1014', agentName: 'Mike Ross', department: 'Billing', topic: 'Invoice Inquiry', date: getRandomDate(), time: '13:45', answered: true, resolved: true, speedOfAnswer: 40, duration: 7.5, satisfactionRating: 3 },
  { id: 'C1015', agentName: 'Jessica Pearson', department: 'Admin', topic: 'Compliance', date: getRandomDate(), time: '14:00', answered: true, resolved: true, speedOfAnswer: 60, duration: 14.0, satisfactionRating: 4 },
  { id: 'C1016', agentName: 'Sarah Conner', department: 'Technical', topic: 'Login Issue', date: getRandomDate(), time: '14:20', answered: true, resolved: true, speedOfAnswer: 10, duration: 4.0, satisfactionRating: 5 },
  { id: 'C1017', agentName: 'John Smith', department: 'Billing', topic: 'Payment Failure', date: getRandomDate(), time: '14:45', answered: false, resolved: false, speedOfAnswer: 0, duration: 0, satisfactionRating: 0 },
  { id: 'C1018', agentName: 'Emily Davis', department: 'Sales', topic: 'Upgrade Plan', date: getRandomDate(), time: '15:00', answered: true, resolved: true, speedOfAnswer: 12, duration: 8.5, satisfactionRating: 4 },
  { id: 'C1019', agentName: 'Mike Ross', department: 'Billing', topic: 'Refund Request', date: getRandomDate(), time: '15:30', answered: true, resolved: false, speedOfAnswer: 50, duration: 12.5, satisfactionRating: 2 },
  { id: 'C1020', agentName: 'Jessica Pearson', department: 'Admin', topic: 'Account Closure', date: getRandomDate(), time: '16:00', answered: true, resolved: true, speedOfAnswer: 30, duration: 5.5, satisfactionRating: 3 },
  { id: 'C1021', agentName: 'Sarah Conner', department: 'Technical', topic: 'System Crash', date: getRandomDate(), time: '16:15', answered: true, resolved: true, speedOfAnswer: 14, duration: 18.0, satisfactionRating: 4 },
  { id: 'C1022', agentName: 'John Smith', department: 'Billing', topic: 'Invoice Inquiry', date: getRandomDate(), time: '16:45', answered: true, resolved: true, speedOfAnswer: 32, duration: 6.5, satisfactionRating: 4 },
  { id: 'C1023', agentName: 'Emily Davis', department: 'Sales', topic: 'New Subscription', date: getRandomDate(), time: '17:00', answered: true, resolved: true, speedOfAnswer: 6, duration: 10.0, satisfactionRating: 5 },
  { id: 'C1024', agentName: 'Mike Ross', department: 'Billing', topic: 'Payment Failure', date: getRandomDate(), time: '17:15', answered: true, resolved: true, speedOfAnswer: 38, duration: 9.0, satisfactionRating: 3 },
  { id: 'C1025', agentName: 'Jessica Pearson', department: 'Admin', topic: 'Compliance', date: getRandomDate(), time: '17:45', answered: true, resolved: true, speedOfAnswer: 45, duration: 13.5, satisfactionRating: 4 },
];

export const COLORS = {
  primary: '#3b82f6', // blue-500
  secondary: '#10b981', // emerald-500
  accent: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  background: '#0f172a', // slate-900
  card: '#1e293b', // slate-800
  text: '#f8fafc', // slate-50
  muted: '#94a3b8', // slate-400
};

export const CHART_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#f97316', // Orange
];
