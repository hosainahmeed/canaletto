
import { IMAGE, propertyDetailsIcon } from '@/assets/images/image.index'
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
  const PROPERTY_INFO = [
    { icon: propertyDetailsIcon.property_files, label: t('property_details.property_file'), styles: { color: '#3b82f680', backgroundColor: "rgba(59, 130, 246, 0.2)" }, route: "/properties/files" },
    { icon: propertyDetailsIcon.payment_status, label: t('property_details.payment_status'), styles: { color: '#22C55E80', backgroundColor: "rgba(34, 197, 94, 0.2)" }, route: "/properties/payment-status" },
    { icon: propertyDetailsIcon.construction, label: t('property_details.construction_progress'), styles: { color: '#B08D5980', backgroundColor: "rgba(176, 141, 89, 0.2)" }, route: "/properties/construction" },
    { icon: propertyDetailsIcon.assigned_agent, label: t('property_details.assigned_agent'), styles: { color: '#A855F780', backgroundColor: "rgba(168, 85, 247, 0.2)" }, route: "/properties/assigned-agent" },
    { icon: propertyDetailsIcon.site_updates, label: t('property_details.site_updates'), styles: { color: '#06B6D480', backgroundColor: "rgba(6, 182, 212, 0.2)" }, route: "/properties/site-updates" },
    { icon: propertyDetailsIcon.property_packages, label: t('property_details.property_packages'), styles: { color: '#EF4444', backgroundColor: "rgba(239, 68, 68, 0.2)" }, route: "/properties/property-packages" },
  ]
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