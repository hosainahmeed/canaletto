import { IMAGE } from '@/assets/images/image.index'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Card from '../cards/Card'

export default function HelpSection() {
  const { width: screenWidth } = useWindowDimensions()
  const router = useRouter()
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/(tabs)/Support')}>
      <Card style={[styles.card, { width: screenWidth - 20 }]}>
        <View>
          <Text style={styles.title}>Need help or have a question?</Text>
          <Text style={styles.description}>Our support team is available 24/7 to assist you</Text>
        </View>
        <LinearGradient style={styles.iconWrapper} colors={["#D4B785", "#B08D59"]}>
          <Image style={styles.icon} source={IMAGE.support_icon_fill} />
        </LinearGradient>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 12,
    backgroundColor: '#fff',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Nunito-Italic',
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Nunito-Italic',
    color: '#5d5c5cff',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    padding: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
})