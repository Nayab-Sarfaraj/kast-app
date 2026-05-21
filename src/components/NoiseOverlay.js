import { StyleSheet, Image } from 'react-native';

export default function NoiseOverlay() {
  return (
    <Image
      source={require('../../assets/noise.png')}
      style={styles.overlay}
      resizeMode="repeat"
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.12,
    zIndex: 1,
  },
});
