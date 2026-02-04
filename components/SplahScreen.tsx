import { useFonts } from 'expo-font';
import { useEffect, useRef } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ setIsReady }: { setIsReady: (value: boolean) => void }) {
  const curvedScreenTranslateY = useSharedValue(height);
  const curvedScreenScale = useSharedValue(0.8);
  const curvedScreenOpacity = useSharedValue(0);
  const borderRadius = useSharedValue(width);

  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [fontsLoaded] = useFonts({
    'Montserrat-Black': require('@/assets/fonts/Montserrat-Black.ttf'),
    'Montserrat-BlackItalic': require('@/assets/fonts/Montserrat-BlackItalic.ttf'),
    'Montserrat-Bold': require('@/assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-BoldItalic': require('@/assets/fonts/Montserrat-BoldItalic.ttf'),
    'Montserrat-ExtraBold': require('@/assets/fonts/Montserrat-ExtraBold.ttf'),
    'Montserrat-ExtraBoldItalic': require('@/assets/fonts/Montserrat-ExtraBoldItalic.ttf'),
    'Montserrat-ExtraLight': require('@/assets/fonts/Montserrat-ExtraLight.ttf'),
    'Montserrat-ExtraLightItalic': require('@/assets/fonts/Montserrat-ExtraLightItalic.ttf'),
    'Montserrat-Italic': require('@/assets/fonts/Montserrat-Italic.ttf'),
    'Montserrat-Light': require('@/assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-LightItalic': require('@/assets/fonts/Montserrat-LightItalic.ttf'),
    'Montserrat-Medium': require('@/assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-MediumItalic': require('@/assets/fonts/Montserrat-MediumItalic.ttf'),
    'Montserrat-Regular': require('@/assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold': require('@/assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-SemiBoldItalic': require('@/assets/fonts/Montserrat-SemiBoldItalic.ttf'),
    'Montserrat-Thin': require('@/assets/fonts/Montserrat-Thin.ttf'),
    'Montserrat-ThinItalic': require('@/assets/fonts/Montserrat-ThinItalic.ttf'),
    'Nunito-Black': require('@/assets/fonts/nunito/Nunito-Black.ttf'),
    'Nunito-BlackItalic': require('@/assets/fonts/nunito/Nunito-BlackItalic.ttf'),
    'Nunito-Bold': require('@/assets/fonts/nunito/Nunito-Bold.ttf'),
    'Nunito-BoldItalic': require('@/assets/fonts/nunito/Nunito-BoldItalic.ttf'),
    'Nunito-ExtraBold': require('@/assets/fonts/nunito/Nunito-ExtraBold.ttf'),
    'Nunito-ExtraBoldItalic': require('@/assets/fonts/nunito/Nunito-ExtraBoldItalic.ttf'),
    'Nunito-ExtraLight': require('@/assets/fonts/nunito/Nunito-ExtraLight.ttf'),
    'Nunito-ExtraLightItalic': require('@/assets/fonts/nunito/Nunito-ExtraLightItalic.ttf'),
    'Nunito-Italic': require('@/assets/fonts/nunito/Nunito-Italic.ttf'),
    'Nunito-Light': require('@/assets/fonts/nunito/Nunito-Light.ttf'),
    'Nunito-LightItalic': require('@/assets/fonts/nunito/Nunito-LightItalic.ttf'),
    'Nunito-Medium': require('@/assets/fonts/nunito/Nunito-Medium.ttf'),
    'Nunito-MediumItalic': require('@/assets/fonts/nunito/Nunito-MediumItalic.ttf'),
    'Nunito-Regular': require('@/assets/fonts/nunito/Nunito-Regular.ttf'),
    'Nunito-SemiBold': require('@/assets/fonts/nunito/Nunito-SemiBold.ttf'),
    'Nunito-SemiBoldItalic': require('@/assets/fonts/nunito/Nunito-SemiBoldItalic.ttf'),
  });

  const curvedScreenStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: curvedScreenTranslateY.value },
        { scale: curvedScreenScale.value }
      ],
      opacity: curvedScreenOpacity.value,
      borderTopLeftRadius: borderRadius.value,
      borderTopRightRadius: borderRadius.value,
    };
  });

  const logoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    curvedScreenOpacity.value = withTiming(1, { duration: 200 });
    curvedScreenTranslateY.value = withTiming(0, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    curvedScreenScale.value = withTiming(1, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });


    borderRadius.value = withTiming(0, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    const schedule = (cb: () => void, delay: number) => {
      const timeoutId = setTimeout(cb, delay);
      timeoutsRef.current.push(timeoutId);
    };

    schedule(() => {
      logoScale.value = withSequence(
        withTiming(1.2, { duration: 500, easing: Easing.out(Easing.back(1.5)) }),
        withTiming(1, { duration: 250 })
      );
      logoOpacity.value = withTiming(1, { duration: 400 });
    }, 800);


    schedule(() => {
      curvedScreenOpacity.value = withTiming(0, { duration: 600 });
      logoOpacity.value = withTiming(0, { duration: 600 });
    }, 2200);


    schedule(() => {
      setIsReady(true);
    }, 2800);

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [fontsLoaded]);

  return (
    <View style={styles.container}>
      {/* Curved Screen from Bottom */}
      <Animated.View style={[styles.curvedScreen, curvedScreenStyle]}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View>
            <Image resizeMode="contain" source={require('@/assets/images/logo.png')} style={styles.logoImage} />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  curvedScreen: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: '#B08D59',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 280,
    height: 220,
    objectFit: "contain"
  },
});