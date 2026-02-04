import React from 'react'
import { KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from 'react-native'

type KeyboardAvoiderProps = {
  children: React.ReactNode
  behavior?: 'height' | 'position' | 'padding'
  style?: StyleProp<ViewStyle>
  keyboardVerticalOffset?: number
}

export default function KeyboardAvoider({
  children,
  behavior = Platform.OS === 'ios' ? 'padding' : 'height',
  style,
  keyboardVerticalOffset = Platform.OS === 'ios' ? 32 : 0,
}: KeyboardAvoiderProps) {
  return (
    <KeyboardAvoidingView
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </KeyboardAvoidingView>
  )
}