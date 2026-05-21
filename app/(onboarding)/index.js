import { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles, Rocket, Palette, Heart } from 'lucide-react-native';
import { COLORS, SIZES, FONTS } from '../../src/constants/theme';
import Typography from '../../src/components/Typography';
import Button from '../../src/components/Button';
import NoiseOverlay from '../../src/components/NoiseOverlay';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: "What's your vision?",
    subtitle: 'Turn your words into stunning AI-generated images in seconds.',
    Icon: Sparkles,
    isGradient: true,
  },
  {
    id: 2,
    title: 'Fast & High Quality',
    subtitle: 'Priority servers deliver your masterpiece in under 10 seconds.',
    Icon: Rocket,
    isGradient: false,
  },
  {
    id: 3,
    title: '30+ Unique Styles',
    subtitle: 'From cinematic to anime — find the perfect aesthetic for your vision.',
    Icon: Palette,
    isGradient: false,
  },
  {
    id: 4,
    title: 'Trusted by Creators',
    subtitle: '"Kast changed how I prototype concepts. Nothing else comes close."',
    Icon: Heart,
    isGradient: false,
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);

  const goNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      const nextSlide = currentSlide + 1;
      scrollRef.current?.scrollTo({ x: nextSlide * width, animated: true });
      setCurrentSlide(nextSlide);
    } else {
      router.replace('/paywall');
    }
  };

  const handleScroll = (e) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slide);
  };

  const isLast = currentSlide === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.slideScroll}
      >
        {SLIDES.map((slide, index) => {
          const Icon = slide.Icon;
          return (
            <View key={slide.id} style={styles.slide}>
              {slide.isGradient ? (
                <LinearGradient
                  colors={[COLORS.plasma, COLORS.electric]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.slideInner}
                >
                  <NoiseOverlay />
                  <View style={styles.slideContent}>
                    <View style={styles.iconContainer}>
                      <Icon size={48} color={COLORS.textPrimary} strokeWidth={1.5} />
                    </View>
                    <Typography variant="h2" align="center" style={styles.slideTitle}>
                      {slide.title}
                    </Typography>
                    <Typography variant="body" color={COLORS.textPrimary} align="center" style={styles.slideSubtitle}>
                      {slide.subtitle}
                    </Typography>
                  </View>
                </LinearGradient>
              ) : (
                <View style={styles.slideInnerDark}>
                  <View style={styles.slideContent}>
                    <View style={styles.iconContainerDark}>
                      <Icon size={48} color={COLORS.plasma} strokeWidth={1.5} />
                    </View>
                    <Typography variant="h2" align="center" style={styles.slideTitle}>
                      {slide.title}
                    </Typography>
                    <Typography variant="body" color={COLORS.textSecondary} align="center" style={styles.slideSubtitle}>
                      {slide.subtitle}
                    </Typography>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <SafeAreaView style={styles.footer}>
        <View style={styles.footerInner}>
          {/* Dots */}
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentSlide ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.footerButtons}>
            <TouchableOpacity onPress={() => router.replace('/paywall')} style={styles.skipButton}>
              <Typography variant="bodyMedium" color={COLORS.textSecondary}>
                Skip
              </Typography>
            </TouchableOpacity>

            <Button
              title={isLast ? 'Get Started' : 'Next'}
              onPress={goNext}
              variant="primary"
              style={styles.nextButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.obsidian,
  },
  slideScroll: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
  },
  slideInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  slideInnerDark: {
    flex: 1,
    backgroundColor: COLORS.obsidian,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    paddingHorizontal: SIZES.paddingGlobal,
    alignItems: 'center',
    zIndex: 2,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainerDark: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.carbon,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  slideTitle: {
    marginBottom: 16,
  },
  slideSubtitle: {
    lineHeight: 26,
    opacity: 0.85,
  },
  footer: {
    backgroundColor: COLORS.obsidian,
    borderTopWidth: 1,
    borderTopColor: COLORS.graphite,
  },
  footerInner: {
    paddingHorizontal: SIZES.paddingGlobal,
    paddingVertical: 20,
    gap: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.textPrimary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: COLORS.charcoal,
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  nextButton: {
    paddingHorizontal: 40,
    height: 52,
  },
});
