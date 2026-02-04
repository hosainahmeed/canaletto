import { Image } from 'expo-image'
import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity } from 'react-native'
const { width } = Dimensions.get("window")
export default function InsightsCard({ title, icon, color, bgColor, onPress }: { title: string, icon: string, color: string, bgColor: string, onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={[styles.container, { backgroundColor: bgColor, borderColor: color }]} onPress={onPress}>
      <Text numberOfLines={1} style={[styles.title, { color: color }]}>{title}</Text>
      <Image source={icon} style={styles.icon} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    flex: 2,
    minWidth: width / 2 - 14,
    borderWidth: 1,
    height: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
  },
  icon: {
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 999
  }
})