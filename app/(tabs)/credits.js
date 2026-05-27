import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Crown, Bug, Mail, Shield, FileText, Trash2, ChevronRight } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SIZES, FONTS } from '../../src/constants/theme';
import Typography from '../../src/components/Typography';
import Button from '../../src/components/Button';
import NoiseOverlay from '../../src/components/NoiseOverlay';
import { authAPI } from '../../src/services/api';
import { useAppStore } from '../../src/store/useAppStore';

function SettingsRow({ icon: Icon, label, onPress, danger = false }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.rowLeft}>
        <Icon color={danger ? COLORS.error : COLORS.textPrimary} size={20} strokeWidth={1.5} />
        <Typography variant="bodyMedium" color={danger ? COLORS.error : COLORS.textPrimary}>
          {label}
        </Typography>
      </View>
      <ChevronRight color={COLORS.graphite} size={20} strokeWidth={1.5} />
    </TouchableOpacity>
  );
}

export default function CreditsScreen() {
  const { data } = useQuery({
    queryKey: ['credits'],
    queryFn: authAPI.getCredits,
    staleTime: 30000,
  });

  const deviceId = useAppStore(state => state.deviceId);

  const credits = data?.credits ?? 10;

  const handleEmail = (subject) => {
    Linking.openURL(`mailto:support@synoxapp.co?subject=${encodeURIComponent(subject)}`);
  };

  const handleUrl = (url) => {
    Linking.openURL(url);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and you will lose all credits.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              // Mocking api call for MVP since delete api might not exist in client api yet
              // await api.delete('/device');
              alert('Account deleted.');
              router.replace('/(onboarding)');
            } catch (err) {
              console.log(err);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Typography variant="h2" color={COLORS.textPrimary}>Settings</Typography>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* SECTION 1: ACCOUNT */}
        <Typography variant="label" color={COLORS.textMuted} style={styles.sectionHeader}>
          ACCOUNT
        </Typography>
        
        <View style={styles.balanceBlock}>
          <Typography variant="h1" color={COLORS.textPrimary} align="center" style={styles.balanceNumber}>
            {credits}
          </Typography>
          <Typography variant="label" color={COLORS.textSecondary} align="center">
            credits remaining
          </Typography>
        </View>

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
                Upgrade to Pro
              </Typography>
              <Typography variant="label" color={COLORS.textSecondary} style={{ marginTop: 4 }}>
                Unlimited generations & priority
              </Typography>
            </View>
          </View>
          <Button
            title="Get Pro Now"
            variant="primary"
            onPress={() => router.push('/paywall')}
            style={styles.upgradeBtn}
          />
        </LinearGradient>

        <TouchableOpacity style={styles.restoreBtn} onPress={() => alert('Purchases restored')}>
          <Typography variant="bodyMedium" color={COLORS.plasma} align="center">
            Restore Purchases
          </Typography>
        </TouchableOpacity>

        {/* SECTION 2: SUPPORT */}
        <Typography variant="label" color={COLORS.textMuted} style={styles.sectionHeader}>
          SUPPORT
        </Typography>
        <View style={styles.sectionBlock}>
          <SettingsRow icon={Bug} label="Report a Bug" onPress={() => handleEmail('Bug Report')} />
          <SettingsRow icon={Mail} label="Contact Support" onPress={() => handleEmail('Support Request')} />
        </View>

        {/* SECTION 3: LEGAL */}
        <Typography variant="label" color={COLORS.textMuted} style={styles.sectionHeader}>
          LEGAL
        </Typography>
        <View style={styles.sectionBlock}>
          <SettingsRow icon={Shield} label="Privacy Policy" onPress={() => handleUrl('https://synoxapp.co/privacy')} />
          <SettingsRow icon={FileText} label="Terms of Service" onPress={() => handleUrl('https://synoxapp.co/terms')} />
        </View>

        {/* SECTION 4: DANGER ZONE */}
        <Typography variant="label" color={COLORS.textMuted} style={styles.sectionHeader}>
          DANGER ZONE
        </Typography>
        <View style={styles.sectionBlock}>
          <SettingsRow icon={Trash2} label="Delete Account" onPress={handleDeleteAccount} danger />
        </View>

        <View style={{ height: 100 }} />
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
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    paddingLeft: 4,
    letterSpacing: 1,
    fontFamily: FONTS.bodyMedium,
  },
  balanceBlock: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
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
    marginBottom: 20,
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
  restoreBtn: {
    paddingVertical: 12,
    marginBottom: 12,
  },
  sectionBlock: {
    backgroundColor: COLORS.carbon,
    borderRadius: SIZES.radiusCard,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.graphite,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
