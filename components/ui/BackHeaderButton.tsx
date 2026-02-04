import { IMAGE } from '@/assets/images/image.index';
import { Image } from 'expo-image';
import React, { memo, useMemo } from 'react';
import {
  ColorValue,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle
} from 'react-native';

interface BackHeaderButtonProps {
  onPress: () => void;
  title?: string;
  containerStyle?: ViewStyle;
  contentWidth?: number;
  spacing?: number;
  buttonSize?: number;
  buttonStyle?: ViewStyle;
  buttonBorderColor?: ColorValue;
  buttonBorderWidth?: number;
  buttonElevation?: number;
  buttonBackgroundColor?: ColorValue;
  rippleColor?: ColorValue;
  iconSource?: any;
  iconSize?: number;
  iconTintColor?: ColorValue;
  showIcon?: boolean;
  titleStyle?: TextStyle;
  titleFontSize?: number;
  titleFontFamily?: string;
  titleFontWeight?: TextStyle['fontWeight'];
  titleColor?: ColorValue;
  titleNumberOfLines?: number;
  titleMaxWidth?: number | string;
  rightElement?: React.ReactNode;
  showRightPlaceholder?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  disabled?: boolean;

  pressableProps?: Omit<PressableProps, 'onPress' | 'style' | 'android_ripple'>;
}
const DEFAULTS = {
  buttonSize: 44,
  iconSize: 24,
  spacing: 22,
  buttonBorderColor: '#DDDDDD',
  buttonBorderWidth: 1,
  buttonElevation: 2,
  buttonBackgroundColor: '#FFFFFF',
  rippleColor: '#DDDDDD',
  titleFontSize: 20,
  titleFontFamily: 'Montserrat-SemiBoldItalic',
  titleFontWeight: '600' as const,
  titleColor: '#000000',
  titleNumberOfLines: 1,
  showIcon: true,
  showRightPlaceholder: true,
} as const;
const BackHeaderButton: React.FC<BackHeaderButtonProps> = memo(({
  onPress,
  title,
  containerStyle,
  contentWidth,
  spacing = DEFAULTS.spacing,
  buttonSize = DEFAULTS.buttonSize,
  buttonStyle,
  buttonBorderColor = DEFAULTS.buttonBorderColor,
  buttonBorderWidth = DEFAULTS.buttonBorderWidth,
  buttonElevation = DEFAULTS.buttonElevation,
  buttonBackgroundColor = DEFAULTS.buttonBackgroundColor,
  rippleColor = DEFAULTS.rippleColor,
  iconSource = IMAGE.back_icon,
  iconSize = DEFAULTS.iconSize,
  iconTintColor,
  showIcon = DEFAULTS.showIcon,
  titleStyle,
  titleFontSize = DEFAULTS.titleFontSize,
  titleFontFamily = DEFAULTS.titleFontFamily,
  titleFontWeight = DEFAULTS.titleFontWeight,
  titleColor = DEFAULTS.titleColor,
  titleNumberOfLines = DEFAULTS.titleNumberOfLines,
  titleMaxWidth,
  rightElement,
  showRightPlaceholder = DEFAULTS.showRightPlaceholder,
  accessibilityLabel = 'Go back',
  accessibilityHint = 'Navigate to previous screen',
  disabled = false,
  pressableProps,
}) => {
  const { width: windowWidth } = useWindowDimensions();

  const containerComputedStyle = useMemo<ViewStyle>(() => ({
    flexDirection: 'row',
    width: contentWidth ?? (windowWidth - 20),
    marginHorizontal: 'auto',
    alignItems: 'center',
    paddingBottom: 12,
    justifyContent: 'space-between',
    ...containerStyle,
  }), [contentWidth, windowWidth, spacing, containerStyle]);

  const buttonComputedStyle = useMemo<ViewStyle>(() => ({
    width: buttonSize,
    height: buttonSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: buttonSize / 2,
    borderWidth: buttonBorderWidth,
    borderColor: buttonBorderColor as string,
    backgroundColor: buttonBackgroundColor as string,
    // elevation: buttonElevation,
    ...buttonStyle,
  }), [
    buttonSize,
    buttonBorderWidth,
    buttonBorderColor,
    buttonBackgroundColor,
    buttonElevation,
    buttonStyle
  ]);

  const iconComputedStyle = useMemo(() => ({
    width: iconSize,
    height: iconSize,
    ...(iconTintColor && { tintColor: iconTintColor as string }),
  }), [iconSize, iconTintColor]);

  const titleComputedStyle = useMemo<any>(() => {
    const maxWidth = titleMaxWidth ?? (contentWidth ?? windowWidth - (spacing * 2)) - (buttonSize * 2) - 32;

    return {
      textAlign: 'center',
      fontWeight: titleFontWeight,
      fontFamily: titleFontFamily,
      fontSize: titleFontSize,
      color: titleColor as string,
      maxWidth: typeof maxWidth === 'number' ? maxWidth : maxWidth,
      flexShrink: 1,
      ...titleStyle,
    };
  }, [
    titleMaxWidth,
    contentWidth,
    windowWidth,
    spacing,
    buttonSize,
    titleFontWeight,
    titleFontFamily,
    titleFontSize,
    titleColor,
    titleStyle
  ]);

  const rippleConfig = useMemo(() => ({
    color: rippleColor as string,
    borderless: false,
    radius: buttonSize / 2,
  }), [rippleColor, buttonSize]);

  return (
    <View style={containerComputedStyle}>
      <Pressable
        onPress={onPress}
        android_ripple={rippleConfig}
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        style={({ pressed }) => [
          buttonComputedStyle,
          pressed && styles.pressed,
        ]}
        {...pressableProps}
      >
        {showIcon && (
          <Image
            source={iconSource}
            style={iconComputedStyle}
            contentFit="contain"
            priority="high"
            transition={300}
            cachePolicy="memory-disk"
          />
        )}
      </Pressable>

      {/* Title */}
      {title && (
        <Text
          numberOfLines={titleNumberOfLines}
          style={titleComputedStyle}
          accessibilityRole="header"
        >
          {title}
        </Text>
      )}


      {rightElement || (showRightPlaceholder && <View style={{ width: buttonSize }} />)}
    </View>
  );
});

BackHeaderButton.displayName = 'BackHeaderButton';

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
});

export default BackHeaderButton;
export type { BackHeaderButtonProps };


//   {/* Example 1: Basic Usage (Same as Original) */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Basic Header"
//     />
//   </View>

//   {/* Example 2: Custom Button Size and Colors */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Custom Styled"
//       buttonSize={50}
//       buttonBorderColor="#007AFF"
//       buttonBackgroundColor="#F0F8FF"
//       rippleColor="#007AFF"
//     />
//   </View>

//   {/* Example 3: Custom Title Styling */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Beautiful Title"
//       titleFontSize={24}
//       titleFontFamily="Montserrat-Bold"
//       titleColor="#FF6B6B"
//       titleStyle={{ letterSpacing: 1 }}
//     />
//   </View>

//   {/* Example 4: With Custom Right Element */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="With Actions"
//       rightElement={
//         <Ionicons name="ellipsis-vertical" size={24} color="black" />
//       }
//     />
//   </View>

//   {/* Example 5: No Icon, Text Only */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Text Only Header"
//       showIcon={false}
//       showRightPlaceholder={false}
//     />
//   </View>

//   {/* Example 6: Custom Icon */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Custom Icon"
//       iconSource={IMAGE.back_icon}
//       iconSize={28}
//       iconTintColor="#007AFF"
//     />
//   </View>

//   {/* Example 7: Elevated Button Style */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Elevated Button"
//       buttonElevation={8}
//       buttonBackgroundColor="#FFFFFF"
//       buttonStyle={{
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//       }}
//     />
//   </View>

//   {/* Example 8: Minimal Style (No Border, No Elevation) */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Minimal"
//       buttonBorderWidth={0}
//       buttonElevation={0}
//       buttonBackgroundColor="transparent"
//     />
//   </View>

//   {/* Example 9: Long Title with Truncation */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="This is a very long title that will be truncated properly"
//       titleNumberOfLines={1}
//     />
//   </View>

//   {/* Example 10: Custom Container Width */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Fixed Width"
//       contentWidth={300}
//     />
//   </View>

//   {/* Example 11: Dark Theme */}
//   <View style={[styles.example, { backgroundColor: '#1a1a1a', padding: 20 }]}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Dark Theme"
//       buttonBorderColor="#444444"
//       buttonBackgroundColor="#2a2a2a"
//       titleColor="#FFFFFF"
//       iconTintColor="#FFFFFF"
//       rippleColor="#666666"
//     />
//   </View>

//   {/* Example 12: Colorful/Branded */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Branded"
//       buttonBackgroundColor="#6C5CE7"
//       buttonBorderColor="#6C5CE7"
//       titleColor="#6C5CE7"
//       iconTintColor="#FFFFFF"
//       rippleColor="#A29BFE"
//     />
//   </View>

//   {/* Example 13: With Multiple Right Actions */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Multiple Actions"
//       rightElement={
//         <View style={{ flexDirection: 'row', gap: 12 }}>
//           <Ionicons name="search" size={24} color="black" />
//           <Ionicons name="ellipsis-vertical" size={24} color="black" />
//         </View>
//       }
//     />
//   </View>

//   {/* Example 14: Disabled State */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Disabled"
//       disabled={true}
//       buttonStyle={{ opacity: 0.5 }}
//     />
//   </View>

//   {/* Example 15: Custom Spacing */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Wide Spacing"
//       spacing={40}
//     />
//   </View>

//   {/* Example 16: Full Width */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Full Width"
//       spacing={0}
//     />
//   </View>

//   {/* Example 17: With Additional Pressable Props */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Long Press"
//       pressableProps={{
//         onLongPress: () => console.log('Long pressed!'),
//         delayLongPress: 500,
//       }}
//     />
//   </View>

//   {/* Example 18: Compact Size */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Compact"
//       buttonSize={36}
//       iconSize={20}
//       titleFontSize={16}
//     />
//   </View>

//   {/* Example 19: Large Size */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Large"
//       buttonSize={56}
//       iconSize={32}
//       titleFontSize={24}
//     />
//   </View>

//   {/* Example 20: Custom Container Style */}
//   <View style={styles.example}>
//     <BackHeaderButton
//       onPress={handleBack}
//       title="Custom Container"
//       containerStyle={{
//         backgroundColor: '#F0F0F0',
//         padding: 12,
//         borderRadius: 12,
//       }}
//     />
//   </View>