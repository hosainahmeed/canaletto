import { IMAGE } from '@/assets/images/image.index'
import { Image } from 'expo-image'
import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
const { width: screenWidth } = Dimensions.get("window")
export default function EmptyCard({ title, icon, backgroundColor, color }: { title: string, icon?: string, backgroundColor?: string, color?: string }) {
  return (
    <View style={{ width: screenWidth - 20, height: 120, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: color, borderRadius: 8, marginHorizontal: "auto", backgroundColor }}>
      <Image source={icon ?? IMAGE.empty} style={styles.icon} />
      <Text style={[styles.title, { color: color }]}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    width: 65,
    height: 43,
    objectFit: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: "#666666",
  }
})