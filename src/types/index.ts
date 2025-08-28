export interface User {
  id: string;
  name: string;
  points: number;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  points: number;
  completed: boolean;
  recurring?: 'daily' | 'weekly' | null;
  createdAt: string;
  completedAt?: string;
}

export type RecurringType = 'daily' | 'weekly' | null;