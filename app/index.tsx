import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Task, User } from '../src/types';
import { storageService } from '../src/services/storage';
import { Ionicons } from '@expo/vector-icons';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const [loadedTasks, loadedUsers] = await Promise.all([
      storageService.getTasks(),
      storageService.getUsers(),
    ]);
    setTasks(loadedTasks.filter(t => !t.completed));
    setUsers(loadedUsers);
  };

  useEffect(() => {
    loadData();
    storageService.resetDailyTasks();
    storageService.resetWeeklyTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCompleteTask = async (taskId: string) => {
    await storageService.completeTask(taskId);
    await loadData();
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unassigned';
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={styles.taskMeta}>
          <Text style={styles.taskUser}>{getUserName(item.assignedTo)}</Text>
          <Text style={styles.taskPoints}>{item.points} pts</Text>
          {item.recurring && (
            <View style={styles.recurringBadge}>
              <Text style={styles.recurringText}>{item.recurring}</Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => handleCompleteTask(item.id)}
      >
        <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No pending tasks</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskUser: {
    fontSize: 14,
    color: '#666',
  },
  taskPoints: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  recurringBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  recurringText: {
    fontSize: 12,
    color: '#FF9800',
  },
  completeButton: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
});