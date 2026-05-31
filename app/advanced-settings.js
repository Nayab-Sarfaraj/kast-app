import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { RefreshCw, Zap, X } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SIZES, FONTS } from '../src/constants/theme';
import Typography from '../src/components/Typography';
import Button from '../src/components/Button';
import { useAppStore } from '../src/store/useAppStore';
import { metaAPI } from '../src/services/api';

const RATIOS = ['1:1', '4:3', '3:4', '9:21'];

export default function AdvancedSettingsScreen() {
  const { settings, updateSettings, selectedModel, setModel } = useAppStore();
  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [localModel, setLocalModel] = useState(selectedModel);

  const { data: modelsData } = useQuery({
    queryKey: ['models'],
    queryFn: metaAPI.getModels,
    staleTime: Infinity,
  });
  const models_list = modelsData || [];

  const update = (key, val) => setLocalSettings(prev => ({ ...prev, [key]: val }));

  const randomizeSeed = () => {
    update('seed', Math.floor(Math.random() * 2147483647));
  };

  const handleApply = () => {
    updateSettings(localSettings);
    setModel(localModel);
    router.back();
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => router.back()} />
      <View style={styles.container}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <View style={styles.handle} />
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
              <X color={COLORS.textPrimary} size={20} strokeWidth={2} />
            </TouchableOpacity>
            <Typography variant="h3" style={styles.title}>Advanced Settings</Typography>
            <View style={{ width: 40 }} />
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Model Selector */}
        <View style={styles.section}>
          <Typography variant="label" color={COLORS.textSecondary} style={styles.sectionLabel}>
            Select Model
          </Typography>
          <View style={styles.modelGrid}>
            {models_list.map((model) => (
              <TouchableOpacity
                key={model.replicateId}
                style={[
                  styles.modelTile,
                  localModel === model.replicateId && styles.modelTileSelected
                ]}
                onPress={() => setLocalModel(model.replicateId)}
                activeOpacity={0.8}
              >
                <Typography 
                  variant="label" 
                  color={localModel === model.replicateId ? COLORS.textPrimary : COLORS.textSecondary}
                  style={styles.modelName}
                >
                  {model.name}
                </Typography>
                <View style={styles.modelCostBadge}>
                  <Zap color={localModel === model.replicateId ? COLORS.textPrimary : COLORS.textMuted} size={12} fill={localModel === model.replicateId ? COLORS.textPrimary : "none"} strokeWidth={2} />
                  <Typography 
                    variant="caption" 
                    color={localModel === model.replicateId ? COLORS.textPrimary : COLORS.textMuted}
                  >
                    {model.credits} Credits
                  </Typography>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Aspect Ratio */}
        <View style={styles.section}>
          <Typography variant="label" color={COLORS.textSecondary} style={styles.sectionLabel}>
            Aspect Ratio
          </Typography>
          <View style={styles.ratioRow}>
            {RATIOS.map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => update('aspectRatio', r)}
                style={[styles.ratioTile, localSettings.aspectRatio === r && styles.ratioTileSelected]}
                activeOpacity={0.8}
              >
                <Typography
                  variant="label"
                  color={localSettings.aspectRatio === r ? COLORS.textPrimary : COLORS.textSecondary}
                >
                  {r}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CFG Scale */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Typography variant="label" color={COLORS.textSecondary}>CFG Scale</Typography>
            <View style={styles.valueBadge}>
              <Typography variant="caption" color={COLORS.textPrimary}>{localSettings.cfgScale.toFixed(1)}</Typography>
            </View>
          </View>
          <View style={styles.sliderLabels}>
            <Typography variant="caption" color={COLORS.textMuted}>More Creative</Typography>
            <Typography variant="caption" color={COLORS.textMuted}>Match Prompt</Typography>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={0.5}
            value={localSettings.cfgScale}
            onValueChange={(v) => update('cfgScale', v)}
            minimumTrackTintColor={COLORS.plasma}
            maximumTrackTintColor={COLORS.graphite}
            thumbTintColor={COLORS.textPrimary}
          />
        </View>

        {/* Steps */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Typography variant="label" color={COLORS.textSecondary}>Steps</Typography>
            <View style={styles.valueBadge}>
              <Typography variant="caption" color={COLORS.textPrimary}>{localSettings.steps}</Typography>
            </View>
          </View>
          <View style={styles.sliderLabels}>
            <Typography variant="caption" color={COLORS.textMuted}>Faster</Typography>
            <Typography variant="caption" color={COLORS.textMuted}>Better Quality</Typography>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={4}
            maximumValue={50}
            step={1}
            value={localSettings.steps}
            onValueChange={(v) => update('steps', v)}
            minimumTrackTintColor={COLORS.plasma}
            maximumTrackTintColor={COLORS.graphite}
            thumbTintColor={COLORS.textPrimary}
          />
        </View>

        {/* Seed */}
        <View style={styles.section}>
          <Typography variant="label" color={COLORS.textSecondary} style={styles.sectionLabel}>Seed</Typography>
          <View style={styles.seedRow}>
            <TextInput
              style={styles.seedInput}
              value={localSettings.seed !== null ? String(localSettings.seed) : ''}
              onChangeText={(v) => update('seed', v ? parseInt(v, 10) : null)}
              placeholder="Random"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
              maxLength={10}
            />
            <TouchableOpacity onPress={randomizeSeed} style={styles.randomizeBtn}>
              <RefreshCw color={COLORS.plasma} size={18} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Negative Prompt */}
        <View style={styles.section}>
          <Typography variant="label" color={COLORS.textSecondary} style={styles.sectionLabel}>
            Negative Prompt
          </Typography>
          <TextInput
            style={styles.negativeInput}
            value={localSettings.negativePrompt}
            onChangeText={(v) => update('negativePrompt', v)}
            placeholder="What to exclude from the image..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        </ScrollView>

        {/* Fixed Footer */}
        <View style={styles.footer}>
          <Button title="Apply Settings" variant="primary" onPress={handleApply} style={styles.applyBtn} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    height: '80%',
    backgroundColor: COLORS.carbon,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: COLORS.graphite,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: SIZES.paddingGlobal,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: COLORS.carbon,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.graphite,
    zIndex: 10,
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: COLORS.graphite,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { textAlign: 'center', flex: 1 },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.obsidian, // Darker background to match screenshot
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: SIZES.paddingGlobal, paddingVertical: 24 },
  footer: {
    paddingHorizontal: SIZES.paddingGlobal,
    paddingVertical: 16,
    backgroundColor: COLORS.carbon,
    borderTopWidth: 1,
    borderTopColor: COLORS.graphite,
  },
  section: { marginBottom: 28 },
  sectionLabel: { marginBottom: 12 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueBadge: {
    backgroundColor: COLORS.graphite,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  modelTile: {
    width: '48%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.obsidian,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  modelTileSelected: {
    backgroundColor: COLORS.plasma,
    borderColor: COLORS.plasma,
  },
  modelName: {
    fontFamily: FONTS.bodySemi,
    marginBottom: 4,
    textAlign: 'center',
  },
  modelCostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    opacity: 0.9,
  },
  ratioRow: { flexDirection: 'row', gap: 10 },
  ratioTile: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.obsidian,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratioTileSelected: {
    borderColor: COLORS.plasma,
    backgroundColor: 'rgba(255,42,95,0.1)',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  slider: { width: '100%', height: 40 },
  seedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.obsidian,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    borderRadius: 12,
    overflow: 'hidden',
  },
  seedInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontFamily: FONTS.body,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  randomizeBtn: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,42,95,0.1)',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.graphite,
  },
  negativeInput: {
    backgroundColor: COLORS.obsidian,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    borderRadius: 12,
    padding: 14,
    color: COLORS.textPrimary,
    fontFamily: FONTS.body,
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  applyBtn: { marginTop: 8 },
});
