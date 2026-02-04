import { IMAGE } from '@/assets/images/image.index';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
const { width: screenWidth } = Dimensions.get('window');
export default function GradientCard({ title, iconType, subTitle, color = ['#22C55E', '#FAFAFA', '#FAFAFA'], onPress }: { title: string; subTitle: string; color?: string[], iconType: 'green' | 'brand' | 'blue' | 'pink', onPress?: () => void }) {
  return (
    <View style={[styles.container, { backgroundColor: color[0], borderColor: color[0] }]}>
      <Text numberOfLines={1} style={styles.subTitle}>{subTitle}</Text>
      <Text numberOfLines={1} style={styles.title}>{title}</Text>
      <Pressable
        onPress={onPress}
        style={{
          width: 36,
          height: 36,
          borderRadius: 100,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image source={iconType === 'green' ? IMAGE.green_forward : iconType === 'brand' ? IMAGE.brand_forward : iconType === 'blue' ? IMAGE.blue_forward : IMAGE.pink_forward} style={{ width: 10, height: 10 }} />
      </Pressable>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={color as any}
        style={[styles.circle, styles.c1]}
      />
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={color as any}
        style={[styles.circle, styles.c2]}
      />
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={color as any}
        style={[styles.circle, styles.c3]}
      />
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={color as any}
        style={[styles.circle, styles.c4]}
      />
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={color as any}
        style={[styles.circle, styles.c5]}
      />
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={color as any}
        style={[styles.circle, styles.c6]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 145,
    width: screenWidth - 20,
    maxHeight: 145,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    opacity: 0.9,
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: 'auto',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    zIndex: 999,
    color: "#fff",
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    zIndex: 999,
    marginBottom: 12,
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
  },

  circle: {
    position: 'absolute',
    borderRadius: 999,
  },

  c1: {
    width: 300,
    height: 300,
    bottom: -144,
    right: -144,
  },
  c2: {
    width: 250,
    height: 250,
    bottom: -120,
    right: -120,
  },
  c3: {
    width: 200,
    height: 200,
    bottom: -96,
    right: -96,
  },
  c4: {
    width: 150,
    height: 150,
    bottom: -72,
    right: -72,
  },
  c5: {
    width: 100,
    height: 100,
    bottom: -48,
    right: -48,
  },
  c6: {
    width: 50,
    height: 50,
    bottom: -24,
    right: -24,
  },
});
