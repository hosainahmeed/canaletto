import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function Card({ children, style, ...props }: { children: React.ReactNode } & React.ComponentProps<typeof View>) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
})
