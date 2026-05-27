import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useQuery } from '@tanstack/react-query';
import { authAPI } from '../src/services/api';
import { useAppStore } from '../src/store/useAppStore';
import { COLORS, SIZES } from '../src/constants/theme';
import Skeleton from '../src/components/Skeleton';

export default function EntryScreen() {
  const [isChecking, setIsChecking] = useState(true);
  const setCredentials = useAppStore(state => state.setCredentials);

  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['checkAuth'],
    queryFn: authAPI.getCredits,
    enabled: false, 
    retry: 0,
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const deviceId = await SecureStore.getItemAsync('synox_device_id');
        const token = await SecureStore.getItemAsync('synox_jwt');

        if (!deviceId || !token) {
          router.replace('/(onboarding)');
          return;
        }

        setCredentials(deviceId, token);
        const { data: authData, isError: authError } = await refetch();

        if (authError || !authData) {
          await SecureStore.deleteItemAsync('synox_device_id');
          await SecureStore.deleteItemAsync('synox_jwt');
          router.replace('/(onboarding)');
        } else {
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
      <SafeAreaView style={styles.safeTop}>
        <View style={styles.topNav}>
          <Skeleton width={180} height={32} borderRadius={8} />
          <Skeleton width={80} height={28} borderRadius={14} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} scrollEnabled={false}>
        {/* Hero Banner Skeleton */}
        <View style={styles.heroBanner}>
          <View style={styles.heroLeft}>
            <Skeleton width={120} height={24} borderRadius={12} style={{ marginBottom: 12 }} />
            <Skeleton width={200} height={40} borderRadius={8} style={{ marginBottom: 8 }} />
            <Skeleton width={160} height={16} borderRadius={4} />
          </View>
          <View style={styles.heroRight}>
            <Skeleton width={96} height={106} borderRadius={16} />
          </View>
        </View>

        {/* Style Picker Skeleton */}
        <View style={styles.sectionHeader}>
          <Skeleton width={100} height={20} borderRadius={4} />
          <Skeleton width={60} height={16} borderRadius={4} />
        </View>
        
        <View style={styles.stylesList}>
          {[1, 2, 3].map(i => (
            <Skeleton key={i} width={100} height={80} borderRadius={12} />
          ))}
        </View>

        {/* Prompt Input Skeleton */}
        <View style={styles.promptHeader}>
          <Skeleton width={120} height={16} borderRadius={4} />
          <Skeleton width={80} height={24} borderRadius={12} />
        </View>
        
        <View style={styles.promptBox}>
          <Skeleton width="100%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="85%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="95%" height={16} borderRadius={4} />
        </View>
      </ScrollView>
      
      {/* FAB Skeleton */}
      <View style={styles.fabContainer}>
         <Skeleton width="100%" height={56} borderRadius={28} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.obsidian },
  safeTop: { backgroundColor: COLORS.obsidian },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingGlobal,
    paddingTop: 12,
    paddingBottom: 16,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SIZES.paddingGlobal, paddingTop: 16 },
  
  heroBanner: {
    height: 180,
    borderRadius: 24,
    backgroundColor: COLORS.carbon,
    flexDirection: 'row',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  heroLeft: { flex: 1, marginRight: 16 },
  heroRight: { alignItems: 'flex-end', justifyContent: 'center' },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stylesList: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promptBox: {
    backgroundColor: COLORS.carbon,
    borderRadius: SIZES.radiusCard,
    padding: 16,
    height: 120,
    marginBottom: 12,
  },
  
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
  },
});
