import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, User } from '../types';

const TASKS_KEY = '@housesync_tasks';
const USERS_KEY = '@housesync_users';

const DEMO_USERS: User[] = [
  { id: '1', name: 'Max', points: 0 },
  { id: '2', name: 'Anna', points: 0 },
  { id: '3', name: 'Tom', points: 0 },
  { id: '4', name: 'Lisa', points: 0 },
];

export const storageService = {
  async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  async getUsers(): Promise<User[]> {
    try {
      const data = await AsyncStorage.getItem(USERS_KEY);
      if (!data) {
        await this.saveUsers(DEMO_USERS);
        return DEMO_USERS;
      }
      return JSON.parse(data);
    } catch {
      return DEMO_USERS;
    }
  },

  async saveUsers(users: User[]): Promise<void> {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  async completeTask(taskId: string): Promise<void> {
    const tasks = await this.getTasks();
    const users = await this.getUsers();
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    if (task.completed) return;
    
    task.completed = true;
    task.completedAt = new Date().toISOString();
    
    const userIndex = users.findIndex(u => u.id === task.assignedTo);
    if (userIndex !== -1) {
      users[userIndex].points += task.points;
    }
    
    await this.saveTasks(tasks);
    await this.saveUsers(users);
  },

  async resetDailyTasks(): Promise<void> {
    const tasks = await this.getTasks();
    const now = new Date();
    
    tasks.forEach(task => {
      if (task.recurring === 'daily' && task.completed) {
        const completedDate = new Date(task.completedAt || '');
        if (completedDate.getDate() !== now.getDate()) {
          task.completed = false;
          delete task.completedAt;
        }
      }
    });
    
    await this.saveTasks(tasks);
  },

  async resetWeeklyTasks(): Promise<void> {
    const tasks = await this.getTasks();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    tasks.forEach(task => {
      if (task.recurring === 'weekly' && task.completed) {
        const completedDate = new Date(task.completedAt || '');
        if (completedDate < weekAgo) {
          task.completed = false;
          delete task.completedAt;
        }
      }
    });
    
    await this.saveTasks(tasks);
  }
};