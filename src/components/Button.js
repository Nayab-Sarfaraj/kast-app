import { StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';
import Typography from './Typography';

export default function Button({ 
  title, 
  onPress, 
  loading = false, 
  icon: Icon, 
  variant = 'primary', 
  disabled = false,
  style 
}) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'outline': return styles.outline;
      case 'gradient': return styles.gradientContainer;
      case 'secondary': return styles.secondary;
      case 'primary':
      default: return styles.primary;
    }
  };

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'secondary' ? COLORS.textPrimary : COLORS.textPrimary} />
      ) : (
        <>
          {Icon && <Icon size={20} color={COLORS.textPrimary} strokeWidth={1.5} />}
          {title && (
            <Typography 
              variant="bodyMedium" 
              style={[
                styles.text, 
                Icon && { marginLeft: 8 },
                (variant === 'outline' || variant === 'secondary') && styles.textSecondary
              ]}
            >
              {title}
            </Typography>
          )}
        </>
      )}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[styles.gradientContainer, style, disabled && styles.disabled]}
      >
        <LinearGradient
          colors={[COLORS.plasma, COLORS.electric]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.base, getButtonStyle(), style, disabled && styles.disabled]}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: SIZES.radiusPill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COLORS.plasma,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.graphite,
  },
  secondary: {
    backgroundColor: COLORS.graphite, // Just a dark grey button
  },
  gradientContainer: {
    height: 56,
    borderRadius: SIZES.radiusPill,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  textSecondary: {
    color: COLORS.textPrimary,
  },
  disabled: {
    opacity: 0.5,
  },
});
