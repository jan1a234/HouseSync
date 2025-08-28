import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, User } from './types';

const TASKS_KEY = 'housesync_tasks';
const USERS_KEY = 'housesync_users';

export const initializeData = async () => {
  const users = await getUsers();
  const tasks = await getTasks();

  if (users.length === 0) {
    const defaultUsers: User[] = [
      { id: '1', name: 'Max', points: 0 },
      { id: '2', name: 'Lisa', points: 0 },
      { id: '3', name: 'Tom', points: 0 },
      { id: '4', name: 'Anna', points: 0 }
    ];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }

  if (tasks.length === 0) {
    const defaultTasks: Task[] = [
      { id: '1', title: 'Küche putzen', assignee: 'Max', points: 5, completed: false, recurring: 'daily' },
      { id: '2', title: 'Müll rausbringen', assignee: 'Lisa', points: 3, completed: false, recurring: 'weekly' },
      { id: '3', title: 'Staubsaugen', assignee: 'Tom', points: 4, completed: false, recurring: 'daily' },
      { id: '4', title: 'Bad putzen', assignee: 'Anna', points: 6, completed: false, recurring: 'weekly' },
      { id: '5', title: 'Einkaufen', assignee: 'Max', points: 3, completed: false, recurring: 'none' }
    ];
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
  }
};

export const getTasks = async (): Promise<Task[]> => {
  const data = await AsyncStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = async (tasks: Task[]) => {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getUsers = async (): Promise<User[]> => {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = async (users: User[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const completeTask = async (taskId: string) => {
  const tasks = await getTasks();
  const users = await getUsers();
  
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return;

  const task = tasks[taskIndex];
  const userIndex = users.findIndex(u => u.name === task.assignee);
  
  if (userIndex !== -1) {
    users[userIndex].points += task.points;
    await saveUsers(users);
  }

  tasks[taskIndex].completed = true;
  tasks[taskIndex].lastCompleted = new Date();

  if (task.recurring !== 'none') {
    const now = new Date();
    const resetTime = task.recurring === 'daily' ? 
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) :
      new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    setTimeout(() => {
      resetTask(taskId);
    }, resetTime.getTime() - now.getTime());
  }

  await saveTasks(tasks);
};

export const resetTask = async (taskId: string) => {
  const tasks = await getTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex !== -1) {
    tasks[taskIndex].completed = false;
    await saveTasks(tasks);
  }
};

export const addTask = async (task: Omit<Task, 'id'>) => {
  const tasks = await getTasks();
  const newTask: Task = {
    ...task,
    id: Date.now().toString()
  };
  tasks.push(newTask);
  await saveTasks(tasks);
};