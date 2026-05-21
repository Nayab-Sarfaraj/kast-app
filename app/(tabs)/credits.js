import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Zap, Crown } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SIZES, FONTS } from '../../src/constants/theme';
import Typography from '../../src/components/Typography';
import Button from '../../src/components/Button';
import NoiseOverlay from '../../src/components/NoiseOverlay';
import { authAPI } from '../../src/services/api';

const MODEL_COSTS = [
  { name: 'Flux Schnell', cost: '10 credits' },
  { name: 'Flux Dev', cost: '20 credits' },
  { name: 'Stable Diffusion XL', cost: '15 credits' },
  { name: 'Playground v2.5', cost: '12 credits' },
];

export default function CreditsScreen() {
  const { data } = useQuery({
    queryKey: ['credits'],
    queryFn: authAPI.getCredits,
    staleTime: 30000,
  });

  const credits = data?.credits ?? 10;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Typography variant="h2" color={COLORS.textPrimary}>Credits</Typography>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Balance Display */}
        <View style={styles.balanceBlock}>
          <Typography variant="h1" color={COLORS.textPrimary} align="center" style={styles.balanceNumber}>
            {credits}
          </Typography>
          <Typography variant="label" color={COLORS.textSecondary} align="center">
            credits remaining
          </Typography>
        </View>

        {/* Upgrade Card */}
        <LinearGradient
          colors={['rgba(255,42,95,0.18)', 'rgba(112,0,255,0.18)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.upgradeCard}
        >
          <NoiseOverlay />
          <View style={styles.upgradeContent}>
            <View style={styles.upgradeIcon}>
              <Crown color={COLORS.plasma} size={24} strokeWidth={1.5} />
            </View>
            <View style={styles.upgradeText}>
              <Typography variant="bodySemi" color={COLORS.textPrimary}>
                Never run out of credits.
              </Typography>
              <Typography variant="label" color={COLORS.textSecondary} style={{ marginTop: 4 }}>
                Unlimited generations with Pro.
              </Typography>
            </View>
          </View>
          <Button
            title="Upgrade to Pro"
            variant="primary"
            onPress={() => router.push('/paywall')}
            style={styles.upgradeBtn}
          />
        </LinearGradient>

        {/* Model Cost Breakdown */}
        <View style={styles.costSection}>
          <Typography
            variant="caption"
            color={COLORS.textMuted}
            style={styles.costSectionLabel}
          >
            USAGE COSTS PER MODEL
          </Typography>

          {MODEL_COSTS.map((m, i) => (
            <View
              key={m.name}
              style={[styles.costRow, i < MODEL_COSTS.length - 1 && styles.costRowBorder]}
            >
              <View style={styles.costRowLeft}>
                <Zap color={COLORS.plasma} size={14} strokeWidth={1.5} />
                <Typography variant="label" color={COLORS.textPrimary}>{m.name}</Typography>
              </View>
              <Typography variant="label" color={COLORS.warning} style={styles.costValue}>
                {m.cost}
              </Typography>
            </View>
          ))}
        </View>

        {/* Free credits info */}
        <View style={styles.freeInfo}>
          <Typography variant="caption" color={COLORS.textMuted} align="center">
            New accounts receive 10 free credits.{'\n'}
            Credits reset is not available on the free plan.
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.obsidian },
  safe: { backgroundColor: COLORS.obsidian },
  header: {
    paddingHorizontal: SIZES.paddingGlobal,
    paddingTop: 16,
    paddingBottom: 8,
  },
  scroll: { paddingHorizontal: SIZES.paddingGlobal, paddingBottom: 40 },
  balanceBlock: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  balanceNumber: {
    fontSize: 72,
    lineHeight: 80,
    marginBottom: 8,
  },
  upgradeCard: {
    borderRadius: SIZES.radiusCard,
    borderWidth: 1,
    borderColor: 'rgba(255,42,95,0.4)',
    padding: 20,
    marginBottom: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    zIndex: 2,
  },
  upgradeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,42,95,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,42,95,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeText: { flex: 1 },
  upgradeBtn: { zIndex: 2 },
  costSection: {
    backgroundColor: COLORS.carbon,
    borderRadius: SIZES.radiusCard,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    overflow: 'hidden',
    marginBottom: 24,
  },
  costSectionLabel: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    letterSpacing: 1,
    fontFamily: FONTS.bodyMedium,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  costRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.graphite,
  },
  costRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  costValue: { fontFamily: FONTS.bodyMedium },
  freeInfo: { paddingVertical: 8 },
});
