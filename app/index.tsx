import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getTasks, completeTask } from '../utils/storage';
import { Task } from '../utils/types';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const loadedTasks = await getTasks();
    setTasks(loadedTasks);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskComplete = async (taskId: string) => {
    await completeTask(taskId);
    loadTasks();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tasks</Text>
      {tasks.map((task) => (
        <View key={task.id} style={styles.taskItem}>
          <TouchableOpacity
            style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
            onPress={() => handleTaskComplete(task.id)}
          >
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <View style={styles.taskDetails}>
            <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
              {task.title}
            </Text>
            <Text style={styles.taskInfo}>
              {task.assignee} • {task.points} Punkte
              {task.recurring !== 'none' && ` • ${task.recurring === 'daily' ? 'täglich' : 'wöchentlich'}`}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 48,
  },
  checkboxCompleted: {
    backgroundColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  taskInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
});