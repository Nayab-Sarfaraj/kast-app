import { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { RefreshCw } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../src/constants/theme';
import Typography from '../src/components/Typography';
import Button from '../src/components/Button';
import { useAppStore } from '../src/store/useAppStore';

const RATIOS = ['1:1', '4:3', '3:4', '9:21'];

export default function AdvancedSettingsScreen() {
  const { settings, updateSettings } = useAppStore();
  const [localSettings, setLocalSettings] = useState({ ...settings });

  const update = (key, val) => setLocalSettings(prev => ({ ...prev, [key]: val }));

  const randomizeSeed = () => {
    update('seed', Math.floor(Math.random() * 2147483647));
  };

  const handleApply = () => {
    updateSettings(localSettings);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Drag Handle */}
      <View style={styles.handle} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Typography variant="h3" style={styles.title}>Advanced Settings</Typography>

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
            placeholder="blurry, low quality, watermark..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <Button title="Apply Settings" variant="primary" onPress={handleApply} style={styles.applyBtn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.carbon,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: COLORS.graphite,
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: COLORS.graphite,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  scroll: { paddingHorizontal: SIZES.paddingGlobal, paddingBottom: 40 },
  title: { marginBottom: 24, marginTop: 12 },
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
