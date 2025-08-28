import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { addTask, getUsers } from '../utils/storage';
import { User } from '../utils/types';

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [points, setPoints] = useState('1');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly'>('none');
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const loadedUsers = await getUsers();
      setUsers(loadedUsers);
      if (loadedUsers.length > 0) {
        setAssignee(loadedUsers[0].name);
      }
    };
    loadUsers();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Titel ein');
      return;
    }

    const pointsNum = parseInt(points);
    if (isNaN(pointsNum) || pointsNum < 1) {
      Alert.alert('Fehler', 'Punkte müssen eine Zahl größer 0 sein');
      return;
    }

    await addTask({
      title: title.trim(),
      assignee,
      points: pointsNum,
      completed: false,
      recurring,
    });

    setTitle('');
    setPoints('1');
    setRecurring('none');
    
    Alert.alert('Erfolg', 'Task wurde hinzugefügt');
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Neue Aufgabe hinzufügen</Text>

      <Text style={styles.label}>Titel</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="z.B. Küche putzen"
      />

      <Text style={styles.label}>Zuweisen an</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={assignee}
          onValueChange={setAssignee}
          style={styles.picker}
        >
          {users.map((user) => (
            <Picker.Item key={user.id} label={user.name} value={user.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Punkte</Text>
      <TextInput
        style={styles.input}
        value={points}
        onChangeText={setPoints}
        placeholder="1"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Wiederholen</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={recurring}
          onValueChange={setRecurring}
          style={styles.picker}
        >
          <Picker.Item label="Nicht wiederholen" value="none" />
          <Picker.Item label="Täglich" value="daily" />
          <Picker.Item label="Wöchentlich" value="weekly" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Hinzufügen</Text>
      </TouchableOpacity>
    </View>
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    minHeight: 48,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    minHeight: 48,
  },
  picker: {
    height: 48,
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    minHeight: 48,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});