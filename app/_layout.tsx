import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { initializeData } from '../utils/storage';

export default function TabLayout() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <div style={{ width: 24, height: 24, backgroundColor: color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Task hinzufügen',
          tabBarIcon: ({ color }) => (
            <div style={{ width: 24, height: 24, backgroundColor: color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => (
            <div style={{ width: 24, height: 24, backgroundColor: color }} />
          ),
        }}
      />
    </Tabs>
  );
}