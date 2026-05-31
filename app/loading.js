import { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SIZES, FONTS } from '../src/constants/theme';
import Typography from '../src/components/Typography';
import { useAppStore } from '../src/store/useAppStore';
import { generationAPI } from '../src/services/api';

export default function LoadingScreen() {
  const params = useLocalSearchParams();
  const incomingJobId = params.jobId;
  const requestedPrompt = params.prompt;
  const requestedModelId = params.modelId;
  const requestedStyleName = params.styleName;
  const requestedModelName = params.modelName;
  const requestedModelCredits = params.modelCredits;
  const requestedSettings = params.settings;
  const { selectedModel } = useAppStore();
  const [activeJobId, setActiveJobId] = useState(incomingJobId || null);
  const [requestError, setRequestError] = useState(null);

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

  const [toastMsg, setToastMsg] = useState(null);
  const toastAnim = useRef(new Animated.Value(-100)).current;

  const showToastAndGoBack = (msg) => {
    if (toastMsg) return;
    setToastMsg(msg);
    Animated.spring(toastAnim, {
      toValue: 60,
      useNativeDriver: true,
      bounciness: 12,
    }).start();

    setTimeout(() => {
      Animated.timing(toastAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        router.back();
      });
    }, 3500);
  };

  // Start generation immediately if no jobId was provided
  useEffect(() => {
    let cancelled = false;

    async function startGeneration() {
      if (activeJobId || !requestedPrompt || !requestedModelId) return;
      try {
        let parsedSettings = {};
        try {
          parsedSettings = requestedSettings ? JSON.parse(requestedSettings) : {};
        } catch (error) {
          parsedSettings = {};
        }

        const res = await generationAPI.generate({
          prompt: requestedPrompt,
          modelId: requestedModelId,
          styleName: requestedStyleName || null,
          settings: parsedSettings,
        });

        if (!cancelled) setActiveJobId(res.jobId);
      } catch (error) {
        if (!cancelled) setRequestError(error);
      }
    }

    startGeneration();
    return () => { cancelled = true; };
  }, [activeJobId, requestedPrompt, requestedModelId, requestedStyleName, requestedSettings]);

  // Poll for job status
  const { data, isError, error } = useQuery({
    queryKey: ['jobStatus', activeJobId],
    queryFn: () => generationAPI.getJobStatus(activeJobId),
    enabled: !!activeJobId,
    refetchInterval: (query) => {
      if (!query.state.data) return 2500;
      if (query.state.data.status === 'COMPLETED' || query.state.data.status === 'FAILED') return false;
      return 2500;
    },
    retry: false, // Don't retry on 400 errors from backend
  });

  useEffect(() => {
    if (requestError) {
      const errMsg = requestError?.response?.data?.error || 'Failed to start generation.';
      showToastAndGoBack(errMsg);
      return;
    }

    if (data?.status === 'COMPLETED') {
      router.replace({ pathname: '/result', params: { jobId: activeJobId, imageUrl: data.imageUrl, refinedPrompt: data.refinedPrompt, originalPrompt: data.prompt } });
    } else if (data?.status === 'FAILED') {
      showToastAndGoBack(data?.error || 'Something went wrong while generating your image.');
    } else if (isError) {
      const errMsg = error?.response?.data?.error || 'Generation failed with an error.';
      showToastAndGoBack(errMsg);
    }
  }, [data, isError, error, requestError, activeJobId]);

  const handleCancel = () => {
    router.back();
  };

  const modelShortName = requestedModelName || requestedModelId?.split('/').pop() || selectedModel?.split('/').pop() || 'flux-schnell';
  const modelCredits = requestedModelCredits || 'N/A';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} />

      {/* Custom Toast */}
      <Animated.View
        style={[
          styles.toast,
          { transform: [{ translateY: toastAnim }] },
        ]}
      >
        <Typography variant="label" color="#FFF" style={styles.toastText}>
          {toastMsg}
        </Typography>
      </Animated.View>

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
            <Typography variant="h2" color={COLORS.plasma}>S</Typography>
          </Animated.View>
        </View>

        <Typography variant="h3" align="center" style={styles.mainText}>
          Synthesizing image...
        </Typography>

        <Typography variant="label" color={COLORS.textSecondary} align="center" style={styles.subText}>
          {modelShortName} · {modelCredits} credits
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
  toast: {
    position: 'absolute',
    top: 0,
    left: SIZES.paddingGlobal,
    right: SIZES.paddingGlobal,
    backgroundColor: COLORS.plasma,
    padding: 16,
    borderRadius: SIZES.radiusCard,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: { textAlign: 'center' },
});
