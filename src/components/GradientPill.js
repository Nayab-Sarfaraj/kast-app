import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';
import Typography from './Typography';

export default function GradientPill({ text, style }) {
  return (
    <LinearGradient
      colors={[COLORS.plasma, COLORS.electric]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <Typography variant="caption" color={COLORS.textPrimary} style={styles.text}>
        {text}
      </Typography>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Inter_600SemiBold', // Force SemiBold
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
