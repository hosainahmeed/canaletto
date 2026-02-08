import { IMAGE } from '@/assets/images/image.index'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Card from '../cards/Card'

export default function HelpSection({ title, description, icon, onPress }: { title?: string; description?: string; icon?: any; onPress?: () => void }) {
  const { width: screenWidth } = useWindowDimensions()
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress || (() => router.push('/(tabs)/Support'))}>
      <Card style={[styles.card, { width: screenWidth - 20 }]}>
        <View>
          <Text numberOfLines={1} style={styles.title}>{title || t("help_section.title")}</Text>
          <Text numberOfLines={1} style={styles.description}>{description || t("help_section.description")}</Text>
        </View>
        <LinearGradient style={styles.iconWrapper} colors={["#D4B785", "#B08D59"]}>
          <Image style={styles.icon} source={icon || IMAGE.support_icon_fill} />
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
    fontSize: 14,
    // fontWeight: '900',
    flexWrap: 'wrap',
    wordWrap: 'wrap',
    fontFamily: 'Nunito-MediumItalic',
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Nunito-Italic',
    color: '#5d5c5cff',
    flexWrap: 'wrap',
    wordWrap: 'wrap',
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
    width: 16,
    height: 16,
  },
})