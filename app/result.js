import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Share,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { ArrowLeft, Download, Share2, RefreshCw, X, Maximize2, ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../src/constants/theme';
import Typography from '../src/components/Typography';
import Button from '../src/components/Button';
import { useAppStore } from '../src/store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import { generationAPI } from '../src/services/api';
import { useState, useEffect } from 'react';
import InAppToast from '../src/components/InAppToast';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const jobId = params.jobId;
  const { currentPrompt, selectedModel, setPrompt } = useAppStore();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [isMagicExpanded, setIsMagicExpanded] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
  };

  // Fetch job details to guarantee we have the refined prompt (magic prompt)
  const { data: jobData } = useQuery({
    queryKey: ['jobStatus', jobId],
    queryFn: () => generationAPI.getJobStatus(jobId),
    enabled: !!jobId,
  });

  useEffect(() => {
    // Clear the prompt input after successful generation so the home screen is fresh
    setPrompt('');
  }, []);

  const imageUrl = params.imageUrl || jobData?.imageUrl;
  const refinedPrompt = jobData?.refinedPrompt || params.refinedPrompt;
  const originalPrompt = jobData?.prompt || params.prompt || currentPrompt;
  const modelId = jobData?.modelId || params.modelId;
  const modelName = params.modelName;
  const modelCredits = String(jobData?.cost ?? params.modelCredits ?? '');
  const styleName = jobData?.styleName || params.styleName;
  const styleModifier = jobData?.styleModifier;
  let parsedSettings = {};
  try {
    parsedSettings = params.settings ? JSON.parse(params.settings) : {};
  } catch (error) {
    parsedSettings = {};
  }
  const settings = jobData?.settings || parsedSettings || {};

  const modelShortName = modelId?.split('/').pop() || selectedModel?.split('/').pop() || 'flux-schnell';

  const renderExpandableText = (label, text, expanded, setExpanded, accent = false) => {
    const value = text || 'N/A';
    const isLong = value.length > 180;
    const displayText = !isLong || expanded ? value : `${value.slice(0, 180).trim()}...`;

    return (
      <View style={styles.infoBlock}>
        <Typography
          variant="caption"
          color={accent ? COLORS.plasma : COLORS.textMuted}
          style={{ marginBottom: 6, fontFamily: FONTS.bodySemi }}
        >
          {label}
        </Typography>
        <Typography variant="bodyMedium" color={COLORS.textPrimary}>
          {displayText}
        </Typography>
        {isLong ? (
          <TouchableOpacity style={styles.seeMoreBtn} onPress={() => setExpanded(!expanded)}>
            <Typography variant="caption" color={COLORS.plasma}>
              {expanded ? 'See less' : 'See more'}
            </Typography>
            {expanded ? (
              <ChevronUp color={COLORS.plasma} size={14} strokeWidth={1.5} />
            ) : (
              <ChevronDown color={COLORS.plasma} size={14} strokeWidth={1.5} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const handleSave = async () => {
    if (!imageUrl) return;
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      showToast('Please allow access to save images.', 'error');
      return;
    }
    try {
      const fileUri = FileSystem.documentDirectory + `synox_${jobId}.jpg`;
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      showToast('Image saved to your camera roll.', 'success');
    } catch (e) {
      console.error(e);
      showToast('Could not save image.', 'error');
    }
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    try {
      const fileUri = FileSystem.documentDirectory + `synox_share_${jobId}.jpg`;
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, { dialogTitle: 'Share your creation' });
      } else {
        await Share.share({ url: imageUrl, message: `Created with Synox` });
      }
    } catch (e) {
      console.error(e);
      showToast('Could not share image.', 'error');
    }
  };

  const handleRegenerate = () => {
    const nextPrompt = originalPrompt || '';
    if (!nextPrompt || !modelId) return;

    router.replace({
      pathname: '/loading',
      params: {
        prompt: nextPrompt,
        modelId,
        modelName: modelName || modelShortName,
        modelCredits,
        styleName: styleName || '',
        settings: JSON.stringify(settings || {}),
      },
    });
  };

  return (
    <View style={styles.container}>
      <InAppToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
      {/* Image - top 65% */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.fullIconBtn} onPress={() => setIsFullScreen(true)}>
              <Maximize2 color={COLORS.textPrimary} size={18} strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}

        {/* Back button overlay */}
        <SafeAreaView style={styles.backOverlay} pointerEvents="box-none">
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft color={COLORS.textPrimary} size={20} strokeWidth={1.5} />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Action Sheet - bottom 35% */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

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

        <TouchableOpacity style={styles.moreInfoBtn} onPress={() => setIsInfoOpen(true)}>
          <Typography variant="bodyMedium" color={COLORS.plasma}>
            More Info
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Full Screen Modal */}
      <Modal visible={isFullScreen} transparent={true} animationType="fade" onRequestClose={() => setIsFullScreen(false)}>
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity 
            style={styles.fullScreenClose}
            onPress={() => setIsFullScreen(false)}
          >
            <X color="#FFF" size={24} />
          </TouchableOpacity>
          {imageUrl && (
            <TouchableOpacity activeOpacity={1} onPress={() => setIsFullScreen(false)} style={styles.fullScreenImageWrapper}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}

        </View>
      </Modal>

      <Modal visible={isInfoOpen} transparent animationType="slide" onRequestClose={() => setIsInfoOpen(false)}>
        <View style={styles.infoBackdrop}>
          <View style={styles.infoSheet}>
            <View style={styles.infoHeader}>
              <Typography variant="bodySemi" color={COLORS.textPrimary}>Image Details</Typography>
              <TouchableOpacity
                style={styles.infoCloseBtn}
                onPress={() => {
                  setIsInfoOpen(false);
                  setIsPromptExpanded(false);
                  setIsMagicExpanded(false);
                }}
              >
                <X color={COLORS.textPrimary} size={18} strokeWidth={1.5} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.infoContent}>
              {renderExpandableText('USER PROMPT', originalPrompt, isPromptExpanded, setIsPromptExpanded)}
              {renderExpandableText('MAGIC PROMPT', refinedPrompt || originalPrompt, isMagicExpanded, setIsMagicExpanded, true)}

              <View style={styles.infoBlock}>
                <Typography variant="caption" color={COLORS.textMuted} style={styles.infoLabel}>MODEL</Typography>
                <Typography variant="bodyMedium" color={COLORS.textPrimary}>{modelId || modelShortName}</Typography>
              </View>

              <View style={styles.infoBlock}>
                <Typography variant="caption" color={COLORS.textMuted} style={styles.infoLabel}>STYLE</Typography>
                <Typography variant="bodyMedium" color={COLORS.textPrimary}>{styleName || 'None'}</Typography>
              </View>

              <View style={styles.infoBlock}>
                <Typography variant="caption" color={COLORS.textMuted} style={styles.infoLabel}>SYSTEM STYLE MODIFIER</Typography>
                <Typography variant="bodyMedium" color={COLORS.textPrimary}>{styleModifier || 'Not provided'}</Typography>
              </View>

              <View style={styles.infoBlock}>
                <Typography variant="caption" color={COLORS.textMuted} style={styles.infoLabel}>SETTINGS USED</Typography>
                <Typography variant="bodyMedium" color={COLORS.textPrimary}>
                  {`Aspect Ratio: ${settings.aspectRatio || 'Not provided'}\nCFG Scale: ${settings.cfgScale ?? 'Not provided'}\nSteps: ${settings.steps ?? 'Not provided'}\nSeed: ${settings.seed ?? 'Not provided'}\nNegative Prompt: ${settings.negativePrompt || 'Not provided'}`}
                </Typography>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: COLORS.graphite,
  },
  fullIconBtn: {
    position: 'absolute',
    right: 16,
    bottom: 40,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
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
  moreInfoBtn: {
    marginTop: 14,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fullScreenClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImageWrapper: {
    width: '100%',
    height: '100%',
  },
  fullScreenPromptOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  fullScreenPromptContent: {
    padding: SIZES.paddingGlobal,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingBottom: 40, // Extra padding for safe area
  },
  infoBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  infoSheet: {
    backgroundColor: COLORS.carbon,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.graphite,
    maxHeight: '88%',
    paddingHorizontal: SIZES.paddingGlobal,
    paddingTop: 14,
    paddingBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    gap: 10,
    paddingBottom: 12,
  },
  infoBlock: {
    backgroundColor: COLORS.obsidian,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    borderRadius: 12,
    padding: 12,
  },
  infoLabel: {
    marginBottom: 6,
    fontFamily: FONTS.bodySemi,
  },
  seeMoreBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
