import { IMAGE } from '@/assets/images/image.index';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken
} from 'react-native';
import SafeAreaViewWithSpacing from '../safe-area/SafeAreaViewWithSpacing';
import NextButton from './NextButton';
import Pagination from './Pagination';
import slideData from './slideData';

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef<FlatList>(null);
  const router = useRouter()
  const { height } = useWindowDimensions()

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const scrollTo = () => {
    if (currentIndex < slideData.length - 1) {
      slideRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    // Navigate to home or main app screen
    router.replace('/(auth)/login')
    console.log('Onboarding finished');
    // Example: navigation.navigate('Home');
  };

  return (
    <SafeAreaViewWithSpacing>
      <View
        style={[styles.container, { position: "relative" }]}>
        <View
          style={{ position: "absolute", zIndex: 1, pointerEvents: "none" }}
        >
          <Image source={IMAGE.bursar} style={{ width: 300, height: height }} />
        </View>
        {/* Slides */}
        <View style={styles.slideContainer}>
          <FlatList
            data={slideData}
            renderItem={({ item }) => <OnboardingItem item={item} />}
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              {
                useNativeDriver: false,
              }
            )}
            scrollEventThrottle={32}
            viewabilityConfig={viewConfig}
            onViewableItemsChanged={viewableItemsChanged}
            ref={slideRef}
          />
        </View>
        {/* Pagination */}
        <Pagination data={slideData} scrollX={scrollX} />
        {/* Next Button */}
        <NextButton
          handleSkip={handleSkip}
          currentIndex={currentIndex}
          slideData={slideData}
          scrollTo={scrollTo}
        />
      </View>

    </SafeAreaViewWithSpacing>
  );
}

const OnboardingItem = ({ item }: { item: any }) => {
  const { width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={[styles.itemContainer, { width }]}>
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  slideContainer: {
    flex: 3,
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 40,
  },
  textContainer: {
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'left',
    color: '#333',
    marginBottom: 15,
    fontFamily: 'Montserrat-Italic',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 0,
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
  },
});