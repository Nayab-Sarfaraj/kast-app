import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { ArrowLeft, Download, Share2, RefreshCw } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../src/constants/theme';
import Typography from '../src/components/Typography';
import Button from '../src/components/Button';
import { useAppStore } from '../src/store/useAppStore';

export default function ResultScreen() {
  const { imageUrl, jobId } = useLocalSearchParams();
  const { currentPrompt, selectedModel } = useAppStore();

  const modelShortName = selectedModel?.split('/').pop() || 'flux-schnell';

  const handleSave = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to save images.');
      return;
    }
    try {
      await MediaLibrary.saveToLibraryAsync(imageUrl);
      Alert.alert('Saved!', 'Image saved to your camera roll.');
    } catch (e) {
      Alert.alert('Error', 'Could not save image.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ url: imageUrl, message: `Created with Kast: ${currentPrompt}` });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegenerate = () => {
    router.replace({ pathname: '/loading', params: { jobId } });
  };

  return (
    <View style={styles.container}>
      {/* Image - top 65% */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}

        {/* Back button overlay */}
        <SafeAreaView style={styles.backOverlay}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft color={COLORS.textPrimary} size={20} strokeWidth={1.5} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Action Sheet - bottom 35% */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        <Typography
          variant="bodyMedium"
          color={COLORS.textPrimary}
          numberOfLines={2}
          style={styles.prompt}
        >
          {currentPrompt || 'Generated image'}
        </Typography>

        <Typography variant="caption" color={COLORS.textMuted} style={styles.meta}>
          {modelShortName} · Created just now
        </Typography>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {/* Save */}
          <TouchableOpacity onPress={handleSave} style={styles.iconBtn}>
            <Download color={COLORS.textPrimary} size={20} strokeWidth={1.5} />
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
            <Share2 color={COLORS.textPrimary} size={20} strokeWidth={1.5} />
          </TouchableOpacity>

          {/* Regenerate - primary CTA */}
          <Button
            title="Regenerate"
            variant="primary"
            onPress={handleRegenerate}
            icon={RefreshCw}
            style={styles.regenBtn}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.obsidian },
  imageContainer: {
    height: '65%',
    position: 'relative',
    backgroundColor: COLORS.carbon,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: COLORS.graphite,
  },
  backOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backBtn: {
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    flex: 1,
    backgroundColor: COLORS.carbon,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.graphite,
    padding: SIZES.paddingGlobal,
    marginTop: -24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.graphite,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  prompt: { marginBottom: 4 },
  meta: { marginBottom: 24 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    width: 56,
    height: 56,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regenBtn: {
    flex: 1,
  },
});
