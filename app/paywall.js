import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { X, Zap, Infinity, Paintbrush, Image as ImageIcon, Check, Users } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../src/constants/theme';
import Typography from '../src/components/Typography';
import Button from '../src/components/Button';
import GradientPill from '../src/components/GradientPill';
import NoiseOverlay from '../src/components/NoiseOverlay';

const FEATURES = [
  { icon: Zap, title: 'Ultra Fast Processing', subtitle: 'Priority server access — no queue' },
  { icon: Infinity, title: 'Unlimited Creations', subtitle: 'No daily limits, ever' },
  { icon: Paintbrush, title: '30+ Premium Styles', subtitle: 'Exclusive artistic models' },
  { icon: ImageIcon, title: '4K Resolution', subtitle: 'Crystal clear artwork' },
];

const COMPARISON = [
  { label: 'Daily Generations', free: '5', pro: 'Unlimited' },
  { label: 'Image Quality', free: 'Standard', pro: '4K' },
  { label: 'Styles', free: '5', pro: '30+' },
  { label: 'Priority Access', free: false, pro: true },
  { label: 'No Watermark', free: false, pro: true },
];

export default function PaywallScreen() {
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [timeLeft] = useState('23:47:12');

  return (
    <View style={styles.container}>
      {/* Skip button */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/home')} style={styles.closeBtn}>
          <X color={COLORS.textSecondary} size={24} strokeWidth={1.5} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Badge + Title */}
        <GradientPill text="PREMIUM ACCESS" style={styles.badge} />
        <Typography variant="h2" align="center" style={styles.title}>
          Unlock Your Full{'\n'}Creative Potential
        </Typography>

        {/* Social Proof */}
        <View style={styles.socialProof}>
          <Users color={COLORS.plasma} size={16} strokeWidth={1.5} />
          <Typography variant="label" color={COLORS.textSecondary} style={styles.socialText}>
            Trusted by <Typography variant="label" color={COLORS.textPrimary}>10,000+ creators</Typography>
          </Typography>
        </View>

        {/* Feature Rows */}
        <View style={styles.featuresBlock}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Icon color={COLORS.plasma} size={20} strokeWidth={1.5} />
                </View>
                <View style={styles.featureText}>
                  <Typography variant="bodyMedium" color={COLORS.textPrimary}>{f.title}</Typography>
                  <Typography variant="label" color={COLORS.textSecondary}>{f.subtitle}</Typography>
                </View>
              </View>
            );
          })}
        </View>

        {/* Comparison Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Typography variant="label" color={COLORS.textMuted} style={styles.tableColLabel}>Feature</Typography>
            <Typography variant="label" color={COLORS.textSecondary} style={styles.tableCol}>Free</Typography>
            <LinearGradient
              colors={[COLORS.plasma, COLORS.electric]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tableColPro}
            >
              <Typography variant="label" color={COLORS.textPrimary}>Pro</Typography>
            </LinearGradient>
          </View>
          {COMPARISON.map((row, i) => (
            <View key={i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
              <Typography variant="label" color={COLORS.textSecondary} style={styles.tableColLabel}>{row.label}</Typography>
              <View style={styles.tableCol}>
                {typeof row.free === 'boolean' ? (
                  row.free
                    ? <Check color={COLORS.success} size={16} strokeWidth={1.5} />
                    : <Typography variant="label" color={COLORS.textMuted}>—</Typography>
                ) : (
                  <Typography variant="label" color={COLORS.textSecondary}>{row.free}</Typography>
                )}
              </View>
              <View style={styles.tableCol}>
                {typeof row.pro === 'boolean' ? (
                  <Check color={COLORS.success} size={16} strokeWidth={1.5} />
                ) : (
                  <Typography variant="label" color={COLORS.textPrimary} style={{ fontFamily: FONTS.bodySemi }}>{row.pro}</Typography>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Countdown */}
        <View style={styles.countdown}>
          <Typography variant="label" color={COLORS.warning}>
            ⏱ Limited offer expires in {timeLeft}
          </Typography>
        </View>

        {/* Plan Cards */}
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'annual' && styles.planCardSelected]}
          onPress={() => setSelectedPlan('annual')}
          activeOpacity={0.8}
        >
          {selectedPlan === 'annual' && (
            <View style={styles.popularBadge}>
              <Typography variant="caption" color={COLORS.textPrimary} style={styles.popularText}>MOST POPULAR</Typography>
            </View>
          )}
          <View style={styles.planInfo}>
            <Typography variant="bodySemi" color={COLORS.textPrimary}>Annual Plan</Typography>
            <Typography variant="label" color={COLORS.textSecondary}>Save 65% vs weekly</Typography>
          </View>
          <View style={styles.planPrice}>
            <Typography variant="h3" color={COLORS.textPrimary}>$39.99</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>/year</Typography>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'weekly' && styles.planCardSelected]}
          onPress={() => setSelectedPlan('weekly')}
          activeOpacity={0.8}
        >
          <View style={styles.planInfo}>
            <Typography variant="bodySemi" color={COLORS.textPrimary}>Weekly Plan</Typography>
            <Typography variant="label" color={COLORS.textSecondary}>Flexible, cancel anytime</Typography>
          </View>
          <View style={styles.planPrice}>
            <Typography variant="h3" color={COLORS.textPrimary}>$2.99</Typography>
            <Typography variant="caption" color={COLORS.textSecondary}>/week</Typography>
          </View>
        </TouchableOpacity>

        {/* CTA */}
        <Button
          title="Unlock Pro Now →"
          variant="gradient"
          onPress={() => router.replace('/(tabs)/home')}
          style={styles.cta}
        />

        {/* Legal */}
        <View style={styles.legal}>
          {['Restore', 'Terms', 'Privacy'].map((t, i) => (
            <TouchableOpacity key={t}>
              <Typography variant="caption" color={COLORS.textMuted}>{t}</Typography>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.obsidian },
  topBar: { alignItems: 'flex-end', paddingHorizontal: SIZES.paddingGlobal, paddingTop: 8 },
  closeBtn: { padding: 8 },
  scroll: { paddingHorizontal: SIZES.paddingGlobal, paddingBottom: 40 },
  badge: { alignSelf: 'center', marginBottom: 20, marginTop: 8 },
  title: { marginBottom: 16 },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 32,
  },
  socialText: { },
  featuresBlock: { gap: 16, marginBottom: 32 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.carbon,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: { flex: 1, gap: 2 },
  table: {
    borderWidth: 1,
    borderColor: COLORS.graphite,
    borderRadius: SIZES.radiusCard,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: COLORS.carbon,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.graphite,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  tableRowAlt: { backgroundColor: COLORS.carbon },
  tableColLabel: { flex: 2, paddingHorizontal: 12 },
  tableCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tableColPro: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  countdown: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  planCard: {
    backgroundColor: COLORS.carbon,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    borderRadius: SIZES.radiusCard,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  planCardSelected: {
    borderColor: COLORS.plasma,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.plasma,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  popularText: { fontFamily: FONTS.bodySemi, letterSpacing: 0.5 },
  planInfo: { gap: 4 },
  planPrice: { alignItems: 'flex-end' },
  cta: { marginTop: 8, marginBottom: 16 },
  legal: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingBottom: 8,
  },
});
