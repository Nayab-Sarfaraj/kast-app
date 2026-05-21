import { View, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.carbon,
    borderWidth: 1,
    borderColor: COLORS.graphite,
    borderRadius: SIZES.radiusCard,
    // NO shadows, NO elevation
  },
});
