import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getUsers } from '../utils/storage';
import { User } from '../utils/types';

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const loadedUsers = await getUsers();
      const sortedUsers = loadedUsers.sort((a, b) => b.points - a.points);
      setUsers(sortedUsers);
    };
    loadUsers();
  }, []);

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}.`;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      {users.map((user, index) => (
        <View key={user.id} style={[
          styles.userItem,
          index === 0 && styles.firstPlace,
          index === 1 && styles.secondPlace,
          index === 2 && styles.thirdPlace
        ]}>
          <Text style={styles.rank}>
            {getRankEmoji(index)}
          </Text>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPoints}>{user.points} Punkte</Text>
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
    textAlign: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  firstPlace: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  secondPlace: {
    backgroundColor: '#F3F4F6',
    borderColor: '#6B7280',
  },
  thirdPlace: {
    backgroundColor: '#FDE2E7',
    borderColor: '#CD853F',
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 16,
    minWidth: 40,
    textAlign: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userPoints: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});