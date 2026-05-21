import { Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export default function Typography({ 
  variant = 'body', 
  color = COLORS.textPrimary, 
  align = 'left',
  style, 
  children,
  ...props
}) {
  const getStyle = () => {
    switch (variant) {
      case 'h1': return styles.h1;
      case 'h2': return styles.h2;
      case 'h3': return styles.h3;
      case 'bodySemi': return styles.bodySemi;
      case 'bodyMedium': return styles.bodyMedium;
      case 'caption': return styles.caption;
      case 'label': return styles.label;
      case 'body':
      default: return styles.body;
    }
  };

  return (
    <Text 
      style={[
        getStyle(), 
        { color, textAlign: align }, 
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: FONTS.heading,
    fontSize: 40,
    lineHeight: 48,
  },
  h2: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    lineHeight: 40,
  },
  h3: {
    fontFamily: FONTS.headingSemi,
    fontSize: 24,
    lineHeight: 32,
  },
  bodySemi: {
    fontFamily: FONTS.bodySemi,
    fontSize: 18,
    lineHeight: 26,
  },
  bodyMedium: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontFamily: FONTS.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: FONTS.body,
    fontSize: 12,
    lineHeight: 16,
  },
});
