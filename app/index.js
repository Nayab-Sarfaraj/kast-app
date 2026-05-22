import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useQuery } from '@tanstack/react-query';
import { authAPI } from '../src/services/api';
import { useAppStore } from '../src/store/useAppStore';
import { COLORS } from '../src/constants/theme';

export default function EntryScreen() {
  const [isChecking, setIsChecking] = useState(true);
  const setCredentials = useAppStore(state => state.setCredentials);

  // We only enable this query if we find a token
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['checkAuth'],
    queryFn: authAPI.getCredits,
    enabled: false, 
    retry: 0, // Don't retry on auth check
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const deviceId = await SecureStore.getItemAsync('synox_device_id');
        const token = await SecureStore.getItemAsync('synox_jwt');

        if (!deviceId || !token) {
          // No credentials found, go to onboarding
          router.replace('/(onboarding)');
          return;
        }

        // Credentials exist, validate them with backend
        setCredentials(deviceId, token);
        const { data: authData, isError: authError } = await refetch();

        if (authError || !authData) {
          // Validation failed
          await SecureStore.deleteItemAsync('synox_device_id');
          await SecureStore.deleteItemAsync('synox_jwt');
          router.replace('/(onboarding)');
        } else {
          // Validation succeeded
          router.replace('/(tabs)/home');
        }
      } catch (error) {
        console.error('Error during auth check:', error);
        router.replace('/(onboarding)');
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.plasma} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.obsidian,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
