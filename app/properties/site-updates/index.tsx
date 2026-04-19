
import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import FilterHeader from '@/components/share/FilterHeader'
import HelpSection from '@/components/share/HelpSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'

const { width } = Dimensions.get('window')

export default function SiteUpdates() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={"Site Updates"}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />

      <FilterHeader
        filterOptions={[
          { label: 'Last 24 Hours', value: '1d' },
          { label: 'Last 3 Days', value: '3d' },
          { label: 'Last Week', value: '1w' },
          { label: 'Last Month', value: '1m' },
        ]}
      />
      <Card style={styles.fileCard}>
        <View style={styles.fileLeft}>
          <Image source={IMAGE.image_placeholder} style={styles.pdfIcon} />
          <View>
            <Text style={styles.fileTitle}>
              Outdoor Tiling
            </Text>
            <Text style={styles.fileDate}>
              08:14 AM 25 Jan 2025
            </Text>
          </View>
        </View>

        <View style={styles.fileActions}>
          <Pressable onPress={() => router.push("/properties/site-updates/construction-images/[id]")}>
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