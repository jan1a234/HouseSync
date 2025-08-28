export interface User {
  id: string;
  name: string;
  points: number;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  points: number;
  completed: boolean;
  recurring: 'none' | 'daily' | 'weekly';
  lastCompleted?: Date;
}