
import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import HelpSection from '@/components/share/HelpSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'

const { width } = Dimensions.get('window')

export default function PropertyPackages() {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={t('page_title.property_packages')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />

      <Card style={styles.fileCard}>
        <View style={styles.fileLeft}>
          <Image source={IMAGE.image_placeholder2} style={styles.pdfIcon} />
          <View>
            <Text style={styles.fileTitle}>
              Essential Support
            </Text>
            <Text style={styles.fileDate}>
              08:14 AM 25 Jan 2025
            </Text>
          </View>
        </View>

        <View style={styles.fileActions}>
          <Pressable onPress={() => router.push("/properties/property-packages/package-brief/[id]")}>
            <Image source={IMAGE.eye} style={styles.actionIcon} />
          </Pressable>
        </View>
      </Card>
      <HelpSection />
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  fileCard: {
    width: width - 20,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    marginTop: 12
  },

  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  pdfIcon: {
    width: 44,
    height: 44,
  },

  fileTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  fileDate: {
    fontSize: 11,
    color: '#6B7280',
  },


  fileActions: {
    flexDirection: 'row',
    gap: 12,
  },

  actionIcon: {
    width: 32,
    height: 32,
  },
})