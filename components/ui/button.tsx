import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import Loading from '../shimmer/Loading';

enum ButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  GHOST = 'ghost',
  OUTLINE = 'outline',
  TEXT = 'text',
  LINK = 'link',
  DANGER = 'danger',
}

enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

interface ButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  type?: ButtonType;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  onPress,
  title,
  disabled = false,
  type = ButtonType.PRIMARY,
  size = ButtonSize.MEDIUM,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}: ButtonProps) {

  const getButtonStyle = () => {
    const baseStyle = [styles.button];

    // Type styles
    switch (type) {
      case ButtonType.PRIMARY:
        baseStyle.push(styles.primary as any);
        break;
      case ButtonType.SECONDARY:
        baseStyle.push(styles.secondary as any);
        break;
      case ButtonType.GHOST:
        baseStyle.push(styles.ghost as any);
        break;
      case ButtonType.OUTLINE:
        baseStyle.push(styles.outline as any);
        break;
      case ButtonType.TEXT:
        baseStyle.push(styles.text as any);
        break;
      case ButtonType.LINK:
        baseStyle.push(styles.link as any);
        break;
      case ButtonType.DANGER:
        baseStyle.push(styles.danger as any);
        break;
    }

    // Size styles
    switch (size) {
      case ButtonSize.SMALL:
        baseStyle.push(styles.small as any);
        break;
      case ButtonSize.MEDIUM:
        baseStyle.push(styles.medium as any);
        break;
      case ButtonSize.LARGE:
        baseStyle.push(styles.large as any);
        break;
    }

    // Full width
    if (fullWidth) {
      baseStyle.push(styles.fullWidth as any);
    }

    // Disabled state
    if (disabled || loading) {
      baseStyle.push(styles.disabled as any);
    }

    // Custom style
    if (style) {
      baseStyle.push(style as any);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];

    // Type text styles
    switch (type) {
      case ButtonType.PRIMARY:
        baseStyle.push(styles.primaryText as any);
        break;
      case ButtonType.SECONDARY:
        baseStyle.push(styles.secondaryText as any);
        break;
      case ButtonType.GHOST:
        baseStyle.push(styles.ghostText as any);
        break;
      case ButtonType.OUTLINE:
        baseStyle.push(styles.outlineText as any);
        break;
      case ButtonType.TEXT:
        baseStyle.push(styles.textText as any);
        break;
      case ButtonType.LINK:
        baseStyle.push(styles.linkText as any);
        break;
      case ButtonType.DANGER:
        baseStyle.push(styles.dangerText as any);
        break;
    }

    // Size text styles
    switch (size) {
      case ButtonSize.SMALL:
        baseStyle.push(styles.smallText as any);
        break;
      case ButtonSize.MEDIUM:
        baseStyle.push(styles.mediumText as any);
        break;
      case ButtonSize.LARGE:
        baseStyle.push(styles.largeText as any);
        break;
    }

    // Custom text style
    if (textStyle) {
      baseStyle.push(textStyle as any);
    }

    return baseStyle;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        ...getButtonStyle(),
        pressed && !disabled && !loading && styles.pressed,
      ]}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loading color="#fff" message='Loading...' />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text numberOfLines={1} style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </Pressable>
  );
}

// Color palette
const colors = {
  white: '#FFFFFF',
  black: '#000000',
  brown: '#B08D59',
  brownLight: '#B08D59',
  brownDark: '#B08D59',
  gray: '#999999',
  grayLight: '#E5E5E5',
  transparent: 'transparent',
};

const styles = StyleSheet.create({
  // Base button styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    // elevation: 2,
    gap: 8,
  },

  // Button types
  primary: {
    backgroundColor: colors.brown,
  },
  secondary: {
    backgroundColor: colors.black,
  },
  ghost: {
    backgroundColor: colors.transparent,
    borderWidth: 0,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.brown,
  },
  text: {
    backgroundColor: colors.transparent,
  },
  link: {
    backgroundColor: colors.transparent,
  },
  danger: {
    backgroundColor: '#DC2626',
  },

  // Button sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },

  // Text styles
  buttonText: {
    fontWeight: '600',
  },

  // Type text colors
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  ghostText: {
    color: colors.brown,
  },
  outlineText: {
    color: colors.brown,
  },
  textText: {
    color: colors.black,
  },
  linkText: {
    color: colors.brown,
    textDecorationLine: 'underline',
  },
  dangerText: {
    color: colors.white,
  },

  // Text sizes
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // States
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});

// Export enums for easy access
export { ButtonSize, ButtonType };

// import Button, { ButtonType, ButtonSize } from './Button';

// // Primary button (default)
// <Button 
//   title="Submit" 
//   onPress={() => console.log('Pressed')} 
// />

// // Different types
// <Button 
//   title="Secondary" 
//   type={ButtonType.SECONDARY}
//   onPress={() => {}} 
// />

// <Button 
//   title="Outline" 
//   type={ButtonType.OUTLINE}
//   onPress={() => {}} 
// />

// <Button 
//   title="Ghost" 
//   type={ButtonType.GHOST}
//   onPress={() => {}} 
// />

// <Button 
//   title="Text Only" 
//   type={ButtonType.TEXT}
//   onPress={() => {}} 
// />

// <Button 
//   title="Link" 
//   type={ButtonType.LINK}
//   onPress={() => {}} 
// />

// // Different sizes
// <Button 
//   title="Small" 
//   size={ButtonSize.SMALL}
//   onPress={() => {}} 
// />

// <Button 
//   title="Large" 
//   size={ButtonSize.LARGE}
//   onPress={() => {}} 
// />

// // Loading state
// <Button 
//   title="Loading..." 
//   loading={true}
//   onPress={() => {}} 
// />

// // Disabled
// <Button 
//   title="Disabled" 
//   disabled={true}
//   onPress={() => {}} 
// />

// // Full width
// <Button 
//   title="Full Width" 
//   fullWidth={true}
//   onPress={() => {}} 
// />

// // With icon (you'll need to import icons)
// <Button 
//   title="With Icon" 
//   icon={<YourIconComponent />}
//   iconPosition="left"
//   onPress={() => {}} 
// />

// // Custom styling
// <Button 
//   title="Custom" 
//   style={{ borderRadius: 20 }}
//   textStyle={{ fontWeight: 'bold' }}
//   onPress={() => {}} 
// />

// // Navigation example
// <Button 
//   title="Go to Profile" 
//   onPress={() => navigation.navigate('Profile')} 
// />

// // Action example
// <Button 
//   title="Delete" 
//   type={ButtonType.DANGER}
//   onPress={() => handleDelete()} 
// />