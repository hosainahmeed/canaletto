import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import ShimmerEffect from './ShimmerEffect'
const { width } = Dimensions.get('window')

export default function PropertyCardShimmer({ style }: { style?: any }) {
  return (
    <ShimmerEffect style={style}>
      <View style={[styles.card, { width: width - 20, height: 263, marginHorizontal: 'auto' }]}>
        <View style={{ height: 220, backgroundColor: '#e0e0e0' }} />
        <View style={{ height: 40, backgroundColor: '#e0e0e0', position: "absolute", bottom: 0, left: 0, right: 0 }} />
      </View>
    </ShimmerEffect>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginHorizontal: "auto",
    position: "relative"
  }
})