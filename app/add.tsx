import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { User, RecurringType } from '../src/types';
import { storageService } from '../src/services/storage';

export default function AddTask() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [points, setPoints] = useState('');
  const [recurring, setRecurring] = useState<RecurringType>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const loadedUsers = await storageService.getUsers();
    setUsers(loadedUsers);
    if (loadedUsers.length > 0) {
      setAssignedTo(loadedUsers[0].id);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !points.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      assignedTo,
      points: parseInt(points, 10),
      completed: false,
      recurring,
      createdAt: new Date().toISOString(),
    };

    const tasks = await storageService.getTasks();
    tasks.push(newTask);
    await storageService.saveTasks(tasks);

    Alert.alert('Success', 'Task added successfully!', [
      { text: 'OK', onPress: () => router.push('/') }
    ]);
    
    setTitle('');
    setPoints('');
    setRecurring(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Task Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Assign To</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={assignedTo}
              onValueChange={setAssignedTo}
              style={styles.picker}
            >
              {users.map((user) => (
                <Picker.Item key={user.id} label={user.name} value={user.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Points *</Text>
          <TextInput
            style={styles.input}
            value={points}
            onChangeText={setPoints}
            placeholder="Enter points (e.g., 10)"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recurring</Text>
          <View style={styles.recurringButtons}>
            <TouchableOpacity
              style={[styles.recurringButton, recurring === null && styles.recurringActive]}
              onPress={() => setRecurring(null)}
            >
              <Text style={[styles.recurringButtonText, recurring === null && styles.recurringActiveText]}>
                None
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.recurringButton, recurring === 'daily' && styles.recurringActive]}
              onPress={() => setRecurring('daily')}
            >
              <Text style={[styles.recurringButtonText, recurring === 'daily' && styles.recurringActiveText]}>
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.recurringButton, recurring === 'weekly' && styles.recurringActive]}
              onPress={() => setRecurring('weekly')}
            >
              <Text style={[styles.recurringButtonText, recurring === 'weekly' && styles.recurringActiveText]}>
                Weekly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  recurringButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  recurringButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  recurringActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  recurringButtonText: {
    fontSize: 14,
    color: '#666',
  },
  recurringActiveText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});