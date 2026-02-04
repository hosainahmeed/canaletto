import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";

const ShimmerEffect = ({ children, style }: { children: any; style: any }) => {
  const shimmerAnim = React.useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const animate = () => {
      shimmerAnim.setValue(0);
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();

    return () => shimmerAnim.stopAnimation();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={[styles.container, style]}>
      {children}
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "30%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
});

export default ShimmerEffect;
