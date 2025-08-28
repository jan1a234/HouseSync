import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { User } from '../src/types';
import { storageService } from '../src/services/storage';
import { Ionicons } from '@expo/vector-icons';

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async () => {
    const loadedUsers = await storageService.getUsers();
    const sortedUsers = [...loadedUsers].sort((a, b) => b.points - a.points);
    setUsers(sortedUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Ionicons name="medal" size={28} color="#FFD700" />;
      case 2:
        return <Ionicons name="medal" size={28} color="#C0C0C0" />;
      case 3:
        return <Ionicons name="medal" size={28} color="#CD7F32" />;
      default:
        return <Text style={styles.position}>{position}</Text>;
    }
  };

  const renderUser = ({ item, index }: { item: User; index: number }) => {
    const position = index + 1;
    const isTop3 = position <= 3;

    return (
      <View style={[styles.userCard, isTop3 && styles.topUserCard]}>
        <View style={styles.positionContainer}>
          {getMedalIcon(position)}
        </View>
        <Text style={[styles.userName, isTop3 && styles.topUserName]}>
          {item.name}
        </Text>
        <View style={styles.pointsContainer}>
          <Text style={[styles.points, isTop3 && styles.topPoints]}>
            {item.points}
          </Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
      </View>
    );
  };

  const getTotalPoints = () => {
    return users.reduce((sum, user) => sum + user.points, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalPoints}>
          Total Points: {getTotalPoints()}
        </Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  header: {
    backgroundColor: '#4A90E2',
    padding: 16,
    alignItems: 'center',
  },
  totalPoints: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
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
  topUserCard: {
    backgroundColor: '#FFF8E1',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  positionContainer: {
    width: 40,
    alignItems: 'center',
  },
  position: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  userName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  topUserName: {
    fontWeight: '600',
    fontSize: 18,
  },
  pointsContainer: {
    alignItems: 'center',
  },
  points: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A90E2',
  },
  topPoints: {
    fontSize: 24,
    color: '#FF9800',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});