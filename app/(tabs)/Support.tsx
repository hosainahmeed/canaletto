import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'

export default function Support() {
  const router = useRouter()
  const { width: screenWidth } = useWindowDimensions()
  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        onPress={() => {
          if (router.canGoBack()) {
            router.back()
          } else {
            router.replace('/')
          }
        }}
        titleFontWeight={800}
        titleFontFamily='Montserrat-Italic'
        titleStyle={styles.headerTitle}
        title="Support"
      />
      <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/chat/1')}>
        <Card style={[styles.card, { width: screenWidth - 12 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: "space-between" }}>
            <Image source={IMAGE.moon} style={styles.icon} />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>• Active</Text>
            </View>
          </View>
          <View style={styles.contentWrapper}>
            <View>
              <Text style={styles.title}>Canaletto Sky World Support</Text>
              <Text style={styles.subtitle}>Our support team is available 24/7 to assist you</Text>
            </View>
            <LinearGradient style={styles.iconWrapper} colors={["#D4B785", "#B08D59"]}>
              <Image style={styles.chatIcon} source={IMAGE.support_icon_fill} />
            </LinearGradient>
          </View>
        </Card>
      </TouchableOpacity>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Italic',
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
    marginHorizontal: 'auto',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 12,
  },
  icon: {
    width: 64,
    height: 64,
  },
  badgeContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 1)',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    color: 'rgba(34, 197, 94, 1)',
  },
  contentWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    color: '#B0B0B0',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    padding: 12,
  },
  chatIcon: {
    width: 24,
    height: 24,
  },
})