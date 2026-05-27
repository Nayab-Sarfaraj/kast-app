import { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SIZES } from '../src/constants/theme';
import Typography from '../src/components/Typography';
import ScreenHeader from '../src/components/ScreenHeader';
import { useAppStore } from '../src/store/useAppStore';
import { metaAPI } from '../src/services/api';

const { width } = Dimensions.get('window');
const TILE_SIZE = (width - SIZES.paddingGlobal * 2 - 12) / 2;

const FALLBACK_STYLES = [
  { name: 'Cinematic', color: '#1a1a2e' },
  { name: 'Anime', color: '#16213e' },
  { name: 'Photorealistic', color: '#0f3460' },
  { name: 'Oil Canvas', color: '#533483' },
  { name: 'Watercolor', color: '#2b2d42' },
  { name: 'Pencil Sketch', color: '#1c1c1c' },
  { name: 'Clay Style', color: '#3d2b1f' },
  { name: 'Renaissance', color: '#2c1810' },
  { name: 'Pop Art', color: '#1a0533' },
  { name: 'Analog Film', color: '#0d1117' },
  { name: 'Epic Portrait', color: '#1a0a0a' },
  { name: 'Neon', color: '#0a0020' },
];

export default function StylesPickerScreen() {
  const { selectedStyle, setStyle } = useAppStore();

  const { data: stylesData } = useQuery({
    queryKey: ['styles'],
    queryFn: metaAPI.getStyles,
    staleTime: Infinity,
  });

  const styles_list = stylesData || FALLBACK_STYLES;

  const handleSelect = (name) => {
    setStyle(name);
    router.back();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Choose Style" />
      </SafeAreaView>

      <FlatList
        data={styles_list}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selectedStyle === item.name;
          return (
            <TouchableOpacity
              onPress={() => handleSelect(item.name)}
              activeOpacity={0.85}
              style={[styles.tile, isSelected && styles.tileSelected]}
            >
              {/* Placeholder tinted background */}
              <View style={[styles.tileImage, { backgroundColor: item.color || COLORS.carbon }]} />

              {/* Name overlay */}
              <View style={styles.tileOverlay}>
                <Typography variant="label" color={COLORS.textPrimary} style={styles.tileName}>
                  {item.name}
                </Typography>
              </View>

              {/* Selected badge */}
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Check color={COLORS.textPrimary} size={12} strokeWidth={2} />
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.obsidian },
  safe: { backgroundColor: COLORS.obsidian },
  grid: { paddingHorizontal: SIZES.paddingGlobal, paddingBottom: 32 },
  row: { gap: 12, marginBottom: 12 },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE * 1.25,
    borderRadius: SIZES.radiusCard,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.graphite,
    position: 'relative',
  },
  tileSelected: {
    borderColor: COLORS.plasma,
    borderWidth: 2,
  },
  tileImage: {
    ...StyleSheet.absoluteFillObject,
  },
  tileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingTop: 32,
    background: 'transparent',
  },
  tileName: { },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.plasma,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
