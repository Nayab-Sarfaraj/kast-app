import { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles, Rocket, Palette, Heart } from 'lucide-react-native';
import { COLORS, FONTS } from '../../src/constants/theme';
import Typography from '../../src/components/Typography';
import NoiseOverlay from '../../src/components/NoiseOverlay';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    type: 'gradient',
    title: "What's your vision?",
    subtitle: 'Turn your words into stunning AI-generated images in seconds.',
    Icon: Sparkles,
  },
  {
    id: 2,
    type: 'radial',
    title: 'Fast & High Quality',
    subtitle: 'Priority servers deliver your masterpiece in under 10 seconds.',
    Icon: Rocket,
  },
  {
    id: 3,
    type: 'purple',
    title: '30+ Unique Styles',
    subtitle: 'From cinematic to anime — find the perfect aesthetic for your vision.',
    Icon: Palette,
  },
  {
    id: 4,
    type: 'quote',
    title: 'Trusted by Creators',
    quote: '"Kast changed how I prototype concepts. Nothing else comes close."',
    attribution: '— Alex D., Concept Artist',
    Icon: Heart,
  },
];

function SlideOne({ slide }) {
  const Icon = slide.Icon;
  return (
    <LinearGradient
      colors={['#FF2A5F', '#7000FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.slideFull}
    >
      <NoiseOverlay opacity={0.12} />
      <View style={styles.contentBottomThird}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <Icon size={32} color="#FFFFFF" strokeWidth={1.5} />
        </View>
        <Typography style={styles.slideTitleWhite}>{slide.title}</Typography>
        <Typography style={styles.slideSubtitleLight}>{slide.subtitle}</Typography>
      </View>
    </LinearGradient>
  );
}

function SlideTwo({ slide }) {
  const Icon = slide.Icon;
  return (
    <View style={[styles.slideFull, { backgroundColor: COLORS.obsidian }]}>
      {/* Simulate particle background with radial-like gradients */}
      <LinearGradient
        colors={['rgba(255, 42, 95, 0.15)', 'transparent']}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(112, 0, 255, 0.15)', 'transparent']}
        start={{ x: 0.2, y: 0.8 }}
        end={{ x: 0.8, y: 0.2 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.contentBottomThird}>
        <View style={[styles.iconContainer, { backgroundColor: COLORS.carbon, borderColor: COLORS.graphite, borderWidth: 1 }]}>
          <Icon size={32} color={COLORS.plasma} strokeWidth={1.5} />
        </View>
        <Typography style={styles.slideTitleWhite}>{slide.title}</Typography>
        <Typography style={styles.slideSubtitleLight}>{slide.subtitle}</Typography>
      </View>
    </View>
  );
}

function SlideThree({ slide }) {
  const Icon = slide.Icon;
  return (
    <View style={[styles.slideFull, { backgroundColor: '#0D0014' }]}>
      <LinearGradient
        colors={['rgba(13,0,20,0)', 'rgba(13,0,20,1)']}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.contentBottomThird}>
        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }]}>
          <Icon size={32} color="#FFFFFF" strokeWidth={1.5} />
        </View>
        <Typography style={styles.slideTitleWhite}>{slide.title}</Typography>
        <Typography style={styles.slideSubtitleLight}>{slide.subtitle}</Typography>
      </View>
    </View>
  );
}

function SlideFour({ slide }) {
  const Icon = slide.Icon;
  return (
    <View style={[styles.slideFull, { backgroundColor: COLORS.obsidian }]}>
      <View style={styles.contentBottomThird}>
        <View style={[styles.iconContainer, { backgroundColor: COLORS.carbon, borderColor: COLORS.graphite, borderWidth: 1 }]}>
          <Icon size={32} color={COLORS.plasma} strokeWidth={1.5} />
        </View>
        <Typography style={styles.slideTitleWhite}>{slide.title}</Typography>
        <Typography style={[styles.slideSubtitleLight, { fontStyle: 'italic', color: COLORS.textSecondary }]}>
          {slide.quote}
        </Typography>
        <Typography style={[styles.slideSubtitleLight, { color: COLORS.textMuted, marginTop: 8 }]}>
          {slide.attribution}
        </Typography>
      </View>
    </View>
  );
}

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
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.slideScroll}
      >
        {SLIDES.map((slide) => {
          return (
            <View key={slide.id} style={{ width, height }}>
              {slide.type === 'gradient' && <SlideOne slide={slide} />}
              {slide.type === 'radial' && <SlideTwo slide={slide} />}
              {slide.type === 'purple' && <SlideThree slide={slide} />}
              {slide.type === 'quote' && <SlideFour slide={slide} />}
            </View>
          );
        })}
      </ScrollView>

      {/* Gradient Overlay for Footer */}
      <LinearGradient
        colors={['transparent', COLORS.obsidian]}
        style={styles.footerGradient}
        pointerEvents="none"
      />

      <View style={styles.footerOverlay}>
        <View style={styles.footerLeft}>
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
          <TouchableOpacity onPress={() => router.replace('/paywall')} style={styles.skipBtn}>
            <Typography style={styles.skipText}>Skip</Typography>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={goNext} style={styles.nextBtn}>
          <Typography style={styles.nextText}>{isLast ? 'Get Started' : 'Next'}</Typography>
        </TouchableOpacity>
      </View>
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
  slideFull: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentBottomThird: {
    position: 'absolute',
    bottom: height * 0.25, // Bottom third approximately
    left: 24,
    right: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  slideTitleWhite: {
    fontFamily: FONTS.h1, // closest to Outfit 700
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  slideSubtitleLight: {
    fontFamily: FONTS.body, // Inter 400
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 24,
  },
  footerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  footerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  footerLeft: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#FFFFFF',
  },
  dotInactive: {
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  skipBtn: {
    paddingVertical: 4,
  },
  skipText: {
    fontFamily: FONTS.bodyMedium,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  nextBtn: {
    backgroundColor: COLORS.plasma,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 9999,
  },
  nextText: {
    fontFamily: FONTS.bodySemi,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
