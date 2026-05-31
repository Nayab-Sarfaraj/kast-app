import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Typography from './Typography';
import { COLORS } from '../constants/theme';

const TOAST_COLORS = {
  success: '#10B981',
  error: '#EF4444',
  info: '#2563EB',
};

export default function InAppToast({ message, type = 'info', visible, onHide, duration = 2200 }) {
  const translateY = useRef(new Animated.Value(-110)).current;

  useEffect(() => {
    if (!visible || !message) return;

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 7,
      tension: 80,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -110,
        duration: 250,
        useNativeDriver: true,
      }).start(() => onHide?.());
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, message, translateY, duration, onHide]);

  if (!visible || !message) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: TOAST_COLORS[type] || TOAST_COLORS.info },
        { transform: [{ translateY }] },
      ]}
    >
      <Typography variant="label" color={COLORS.textPrimary} style={styles.text}>
        {message}
      </Typography>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 58,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  text: {
    textAlign: 'center',
  },
});
