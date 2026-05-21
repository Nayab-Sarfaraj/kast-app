import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS, SIZES } from '../constants/theme';
import Typography from './Typography';

export default function ScreenHeader({ 
  title, 
  showBack = true, 
  onBack, 
  rightComponent 
}) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft color={COLORS.textPrimary} size={24} strokeWidth={1.5} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.center}>
        {title && (
          <Typography variant="h3" align="center">
            {title}
          </Typography>
        )}
      </View>

      <View style={styles.right}>
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.paddingGlobal,
    height: 60,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
});
