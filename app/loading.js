import { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SIZES, FONTS } from '../src/constants/theme';
import Typography from '../src/components/Typography';
import { useAppStore } from '../src/store/useAppStore';
import { generationAPI } from '../src/services/api';

export default function LoadingScreen() {
  const { jobId } = useLocalSearchParams();
  const { selectedModel } = useAppStore();

  const pulse = useRef(new Animated.Value(1)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulsing logo animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Expanding ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(ring, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(ring, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const ringScale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });
  const ringOpacity = ring.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.6, 0.1, 0] });

  // Poll for job status
  const { data, isError } = useQuery({
    queryKey: ['jobStatus', jobId],
    queryFn: () => generationAPI.getJobStatus(jobId),
    enabled: !!jobId,
    refetchInterval: (data) => {
      if (!data) return 2500;
      if (data.status === 'COMPLETED' || data.status === 'FAILED') return false;
      return 2500;
    },
  });

  useEffect(() => {
    if (data?.status === 'COMPLETED') {
      router.replace({ pathname: '/result', params: { jobId, imageUrl: data.imageUrl } });
    } else if (data?.status === 'FAILED' || isError) {
      router.back();
    }
  }, [data, isError]);

  const handleCancel = () => {
    router.back();
  };

  const modelShortName = selectedModel?.split('/').pop() || 'flux-schnell';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} />

      <View style={styles.content}>
        {/* Animated Ring */}
        <View style={styles.ringContainer}>
          <Animated.View
            style={[
              styles.outerRing,
              { transform: [{ scale: ringScale }], opacity: ringOpacity },
            ]}
          />
          <Animated.View style={[styles.innerCircle, { transform: [{ scale: pulse }] }]}>
            <Typography variant="h2" color={COLORS.plasma}>K</Typography>
          </Animated.View>
        </View>

        <Typography variant="h3" align="center" style={styles.mainText}>
          Synthesizing image...
        </Typography>

        <Typography variant="label" color={COLORS.textSecondary} align="center" style={styles.subText}>
          {modelShortName} · 10 credits
        </Typography>

        <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
          <Typography variant="label" color={COLORS.textMuted}>Cancel</Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.obsidian },
  safe: { backgroundColor: COLORS.obsidian },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingGlobal,
  },
  ringContainer: {
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  outerRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: COLORS.plasma,
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.carbon,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: { marginBottom: 8 },
  subText: { marginBottom: 48 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 24 },
});
