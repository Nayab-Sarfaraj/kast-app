import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ImageOff, Sparkles } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../../src/constants/theme';
import Typography from '../../src/components/Typography';
import Button from '../../src/components/Button';
import Skeleton from '../../src/components/Skeleton';
import { generationAPI } from '../../src/services/api';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - SIZES.paddingGlobal * 2 - 12) / 2;

function HistorySkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton width="100%" height={CARD_SIZE} borderRadius={0} />
      <View style={styles.cardFooter}>
        <Skeleton width="85%" height={16} borderRadius={4} />
        <View style={styles.cardMeta}>
          <Skeleton width={50} height={20} borderRadius={4} />
        </View>
      </View>
    </View>
  );
}

function HistoryCard({ item }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/result', params: { imageUrl: item.imageUrl, jobId: item.id } })}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={styles.cardImagePlaceholder}>
          <ImageOff color={COLORS.textMuted} size={24} strokeWidth={1.5} />
        </View>
      )}
      <View style={styles.cardFooter}>
        <Typography variant="caption" color={COLORS.textPrimary} numberOfLines={1} style={styles.cardPrompt}>
          {item.prompt || 'Generated image'}
        </Typography>
        <View style={styles.cardMeta}>
          <View style={styles.modelBadge}>
            <Typography variant="caption" color={COLORS.textMuted} numberOfLines={1}>
              {item.modelId?.split('/').pop() || 'flux'}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <ImageOff color={COLORS.textMuted} size={40} strokeWidth={1.5} />
      </View>
      <Typography variant="bodyMedium" color={COLORS.textPrimary} align="center" style={styles.emptyTitle}>
        No generations yet
      </Typography>
      <Typography variant="label" color={COLORS.textSecondary} align="center" style={styles.emptySubtitle}>
        Your created images will appear here
      </Typography>
      <Button
        title="Generate your first image"
        variant="outline"
        onPress={() => router.push('/(tabs)/home')}
        style={styles.emptyBtn}
      />
    </View>
  );
}

export default function HistoryScreen() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['history'],
    queryFn: generationAPI.getHistory,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  const generations = data?.pages?.flatMap((p) => p.data || []) ?? [];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Typography variant="h2" color={COLORS.textPrimary}>History</Typography>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View style={styles.list}>
          <View style={styles.row}>
            <HistorySkeleton />
            <HistorySkeleton />
          </View>
          <View style={styles.row}>
            <HistorySkeleton />
            <HistorySkeleton />
          </View>
          <View style={styles.row}>
            <HistorySkeleton />
            <HistorySkeleton />
          </View>
        </View>
      ) : generations.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={generations}
          keyExtractor={(item) => item.id || item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => <HistoryCard item={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.obsidian },
  safe: { backgroundColor: COLORS.obsidian },
  header: {
    paddingHorizontal: SIZES.paddingGlobal,
    paddingTop: 16,
    paddingBottom: 16,
  },
  list: { paddingHorizontal: SIZES.paddingGlobal, paddingBottom: 32 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12, justifyContent: 'space-between' },
  card: {
    width: CARD_SIZE,
    borderRadius: SIZES.radiusImage,
    backgroundColor: COLORS.carbon,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: CARD_SIZE,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: CARD_SIZE,
    backgroundColor: COLORS.graphite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: { padding: 10, gap: 6 },
  cardPrompt: { },
  cardMeta: { flexDirection: 'row' },
  modelBadge: {
    backgroundColor: COLORS.graphite,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.paddingGlobal,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.carbon,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: { marginBottom: 8 },
  emptySubtitle: { marginBottom: 28 },
  emptyBtn: { paddingHorizontal: 24 },
});
