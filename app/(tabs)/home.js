import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles, Settings, ChevronRight, Image as ImageIcon, Zap, Shuffle } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SIZES, FONTS } from '../../src/constants/theme';
import Typography from '../../src/components/Typography';
import NoiseOverlay from '../../src/components/NoiseOverlay';
import { useAppStore } from '../../src/store/useAppStore';
import { metaAPI, generationAPI } from '../../src/services/api';

const RANDOM_PROMPTS = [
  "A lone astronaut on a neon-lit alien planet",
  "Cyberpunk samurai in the rain, cinematic",
  "Ancient library with floating books and golden light",
  "A wolf made of storm clouds at midnight",
  "Underwater city with bioluminescent creatures",
  "A giant mechanical spider weaving a web of stars",
  "Holographic Koi fish swimming through a futuristic city",
  "A cozy cabin in the woods, glowing warmly in the snow",
  "A magical forest where the leaves are glowing crystals",
  "A steampunk airship flying through cotton candy clouds",
  "A knight with armor made of dark glass facing a dragon",
  "A floating island with waterfalls cascading into space",
  "A sleek futuristic sports car driving on a synthwave grid",
  "A portrait of a queen with a crown made of fire",
  "An abandoned temple overgrown with glowing moss",
  "A wizard casting a spell that creates a miniature galaxy",
  "A robotic dog playing fetch with a drone",
  "A massive tree with a city built into its branches",
  "A post-apocalyptic desert with giant rusted mechs",
  "A magical potion bottle containing a tiny thunderstorm"
];

const MOCK_STYLES = [
  { name: 'Cinematic' }, { name: 'Anime' }, { name: 'Photorealistic' },
  { name: 'Oil Canvas' }, { name: 'Watercolor' }, { name: 'Neon' },
];

export default function HomeScreen() {
  const { currentPrompt, selectedStyle, selectedModel, settings, setPrompt, setStyle, setModel } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

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

  const { data: historyData } = useQuery({
    queryKey: ['history', 'latest'],
    queryFn: () => generationAPI.getHistory({ pageParam: 1 }),
  });

  const styles_list = stylesData || [];
  const models_list = modelsData || [];
  const latestGeneration = historyData?.data?.[0]?.imageUrl;

  const handleGenerate = async () => {
    if (!currentPrompt.trim() || isGenerating) return;
    try {
      setIsGenerating(true);
      const res = await generationAPI.generate({
        prompt: currentPrompt,
        modelId: selectedModel,
        styleName: selectedStyle,
        settings,
      });
      router.push({ pathname: '/loading', params: { jobId: res.jobId } });
    } catch (error) {
      console.error('Failed to start generation', error);
      alert('Failed to start generation. Check if you have credits!');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRandomPrompt = () => {
    const randomPrompt = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
    setPrompt(randomPrompt);
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
        {/* Hero Banner Redesign */}
        <LinearGradient
          colors={['#FF2A5F', '#7000FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <NoiseOverlay opacity={0.15} />
          {/* Radial Glow Simulation */}
          <View style={styles.heroGlow} />

          <View style={styles.heroLayout}>
            <View style={styles.heroLeft}>
              <View style={styles.heroPill}>
                <Typography variant="caption" color={COLORS.textPrimary} style={styles.heroPillText}>
                  CAST YOUR VISION
                </Typography>
              </View>
              <Typography color={COLORS.textPrimary} style={styles.heroTitle}>
                Create Art in Seconds
              </Typography>
              <Typography variant="label" style={styles.heroSubtitle}>
                AI-powered imagery, on demand.
              </Typography>
            </View>
            <View style={styles.heroRight}>
              {latestGeneration ? (
                <Image source={{ uri: latestGeneration }} style={styles.heroThumb} />
              ) : (
                <View style={[styles.heroThumb, styles.heroThumbPlaceholder]}>
                  <ImageIcon color={COLORS.textPrimary} size={32} opacity={0.5} strokeWidth={1.5} />
                </View>
              )}
            </View>
          </View>
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
        <View style={styles.promptHeader}>
          <Typography variant="label" color={COLORS.textSecondary}>
            Creative Prompt
          </Typography>
          <TouchableOpacity style={styles.randomBtn} onPress={handleRandomPrompt}>
            <Shuffle color={COLORS.plasma} size={16} strokeWidth={2} />
            <Typography variant="caption" color={COLORS.plasma}>Random</Typography>
          </TouchableOpacity>
        </View>

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

        <View style={{ height: 200 }} />
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
    height: 180,
    borderRadius: SIZES.radiusCard,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  heroGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    left: -50,
  },
  heroLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heroLeft: {
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    paddingTop: 4,
  },
  heroPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  heroPillText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: FONTS.bodySemi,
  },
  heroTitle: {
    fontFamily: FONTS.h2,
    fontSize: 24,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  heroRight: {
    paddingBottom: 10,
  },
  heroThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    transform: [{ rotate: '-5deg' }],
  },
  heroThumbPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: { marginBottom: 12 },
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

  modelList: {
    gap: 8,
    marginBottom: 24,
    paddingBottom: 4,
  },
  modelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.carbon,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modelPillSelected: {
    backgroundColor: COLORS.plasma,
    borderColor: COLORS.plasma,
  },
  modelCostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    opacity: 0.8,
  },

  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  randomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,42,95,0.1)',
    borderRadius: 12,
  },
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
    bottom: 100,
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
});
