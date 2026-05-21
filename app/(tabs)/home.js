import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles, History, Settings, ChevronRight, Image as ImageIcon } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SIZES, FONTS } from '../../src/constants/theme';
import Typography from '../../src/components/Typography';
import Button from '../../src/components/Button';
import GradientPill from '../../src/components/GradientPill';
import NoiseOverlay from '../../src/components/NoiseOverlay';
import { useAppStore } from '../../src/store/useAppStore';
import { metaAPI } from '../../src/services/api';

const TABS = [
  { name: 'home', icon: Sparkles, label: 'Generate' },
  { name: 'history', icon: History, label: 'History' },
  { name: 'credits', icon: Settings, label: 'Credits' },
];

export default function HomeScreen() {
  const { currentPrompt, selectedStyle, setPrompt, setStyle } = useAppStore();
  const [activeTab, setActiveTab] = useState('home');

  const { data: stylesData } = useQuery({
    queryKey: ['styles'],
    queryFn: metaAPI.getStyles,
    staleTime: Infinity,
  });

  const { data: modelsData } = useQuery({
    queryKey: ['models'],
    queryFn: metaAPI.getModels,
    staleTime: Infinity,
  });

  const styles_list = stylesData || [];

  const handleGenerate = () => {
    if (!currentPrompt.trim()) return;
    router.push('/loading');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeTop}>
        {/* Top Nav */}
        <View style={styles.topNav}>
          <Typography variant="h3" color={COLORS.textPrimary}>
            What's your vision?
          </Typography>
          <TouchableOpacity onPress={() => router.push('/paywall')}>
            <LinearGradient
              colors={[COLORS.plasma, COLORS.electric]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.proButton}
            >
              <Typography variant="caption" color={COLORS.textPrimary} style={styles.proText}>
                GET PRO
              </Typography>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Banner */}
        <LinearGradient
          colors={['rgba(255,42,95,0.15)', 'rgba(112,0,255,0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <NoiseOverlay />
          <View style={styles.heroPill}>
            <Typography variant="caption" color={COLORS.plasma} style={{ fontFamily: FONTS.bodySemi, letterSpacing: 1 }}>
              MASTERPIECE
            </Typography>
          </View>
          <Typography variant="h3" color={COLORS.textPrimary} style={styles.heroTitle}>
            Create Art in Seconds
          </Typography>
          <Typography variant="label" color={COLORS.textSecondary}>
            AI-powered imagery, on demand.
          </Typography>
        </LinearGradient>

        {/* Style Picker */}
        <View style={styles.sectionHeader}>
          <Typography variant="bodyMedium" color={COLORS.textPrimary}>Select Style</Typography>
          <TouchableOpacity
            style={styles.sectionLink}
            onPress={() => router.push('/styles-picker')}
          >
            <Typography variant="label" color={COLORS.plasma}>See all</Typography>
            <ChevronRight color={COLORS.plasma} size={16} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          data={styles_list.length > 0 ? styles_list : MOCK_STYLES}
          keyExtractor={(item) => item.id || item.name}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stylesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.styleTile,
                selectedStyle === item.name && styles.styleTileSelected,
              ]}
              onPress={() => setStyle(item.name)}
              activeOpacity={0.8}
            >
              <View style={styles.styleTileInner}>
                <ImageIcon color={selectedStyle === item.name ? COLORS.plasma : COLORS.textMuted} size={24} strokeWidth={1.5} />
                <Typography
                  variant="caption"
                  color={selectedStyle === item.name ? COLORS.plasma : COLORS.textSecondary}
                  style={styles.styleName}
                >
                  {item.name}
                </Typography>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Prompt Input */}
        <Typography variant="label" color={COLORS.textSecondary} style={styles.promptLabel}>
          Creative Prompt
        </Typography>
        <View style={styles.promptBox}>
          <TextInput
            style={styles.promptInput}
            placeholder="Describe your masterpiece..."
            placeholderTextColor={COLORS.textMuted}
            value={currentPrompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Advanced Settings Link */}
        <TouchableOpacity
          style={styles.advancedBtn}
          onPress={() => router.push('/advanced-settings')}
        >
          <Settings color={COLORS.textSecondary} size={16} strokeWidth={1.5} />
          <Typography variant="label" color={COLORS.textSecondary}>Advanced Settings</Typography>
          <ChevronRight color={COLORS.textMuted} size={14} strokeWidth={1.5} />
        </TouchableOpacity>

        {/* Spacer for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Generate Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, !currentPrompt.trim() && styles.fabDisabled]}
          onPress={handleGenerate}
          activeOpacity={0.85}
          disabled={!currentPrompt.trim()}
        >
          <Sparkles color={COLORS.textPrimary} size={20} strokeWidth={1.5} />
          <Typography variant="bodySemi" color={COLORS.textPrimary}>Generate</Typography>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <SafeAreaView style={styles.bottomNav}>
        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tab}
                onPress={() => {
                  setActiveTab(tab.name);
                  if (tab.name !== 'home') router.push(`/(tabs)/${tab.name}`);
                }}
              >
                <Icon
                  color={isActive ? COLORS.plasma : COLORS.textMuted}
                  size={24}
                  strokeWidth={1.5}
                />
                <Typography
                  variant="caption"
                  color={isActive ? COLORS.plasma : COLORS.textMuted}
                >
                  {tab.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const MOCK_STYLES = [
  { name: 'Cinematic' }, { name: 'Anime' }, { name: 'Photorealistic' },
  { name: 'Oil Canvas' }, { name: 'Watercolor' }, { name: 'Neon' },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.obsidian },
  safeTop: { backgroundColor: COLORS.obsidian },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingGlobal,
    paddingVertical: 16,
  },
  proButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  proText: { fontFamily: FONTS.bodySemi, letterSpacing: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SIZES.paddingGlobal },
  heroBanner: {
    height: 160,
    borderRadius: SIZES.radiusCard,
    padding: 20,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255,42,95,0.3)',
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroPill: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.plasma,
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  heroTitle: { marginBottom: 4 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  stylesList: { paddingBottom: 4, gap: 10, marginBottom: 24 },
  styleTile: {
    width: 100,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.carbon,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styleTileSelected: {
    borderColor: COLORS.plasma,
    backgroundColor: 'rgba(255,42,95,0.08)',
  },
  styleTileInner: { alignItems: 'center', gap: 6 },
  styleName: { textAlign: 'center' },
  promptLabel: { marginBottom: 8 },
  promptBox: {
    backgroundColor: COLORS.carbon,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    borderRadius: SIZES.radiusCard,
    padding: 16,
    minHeight: 120,
    marginBottom: 12,
  },
  promptInput: {
    color: COLORS.textPrimary,
    fontFamily: FONTS.body,
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
    minHeight: 80,
  },
  advancedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    left: SIZES.paddingGlobal,
    right: SIZES.paddingGlobal,
  },
  fab: {
    backgroundColor: COLORS.plasma,
    height: 56,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  fabDisabled: { opacity: 0.5 },
  bottomNav: {
    backgroundColor: COLORS.obsidian,
    borderTopWidth: 1,
    borderTopColor: COLORS.graphite,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
