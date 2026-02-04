import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'

import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing, {
  SafeAreaEdge,
} from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'

type LegalItem = {
  title: string
  value: string
}

export default function LegalCompanyInfo() {
  const router = useRouter()

  const companyLegalData: LegalItem[] = [
    {
      title: 'Company Name',
      value: 'Canaletto Sky Real Estate LLC',
    },
    {
      title: 'Registered Office Address',
      value:
        'Office 1204, Business Bay Tower\nBusiness Bay, Dubai, United Arab Emirates',
    },
    {
      title: 'Trade License Number',
      value: 'TL-9876543',
    },
    {
      title: 'Issuing Authority',
      value: 'Dubai Department of Economy and Tourism (DET)',
    },
    {
      title: 'Business Activity',
      value: 'Real Estate Development and Property Investment Services',
    },
    {
      title: 'Phone Number',
      value: '+971 4 123 4567',
    },
    {
      title: 'Official Website',
      value: 'https://www.canalettosky.com',
    },
  ]

  const renderItem = ({ item }: { item: LegalItem }) => (
    <Card style={styles.card}>
      <Text style={styles.label}>{item.title}</Text>
      <Text style={styles.value}>{item.value}</Text>
    </Card>
  )

  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]}>
      <BackHeaderButton
        title="Legal & Company Info"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={styles.headerTitle}
      />

      <FlatList
        data={companyLegalData}
        keyExtractor={(item) => item.title}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaViewWithSpacing>
  )
}
const styles = StyleSheet.create({
  headerTitle: {
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Italic',
  },

  listContent: {
    paddingBottom: 24,
    gap: 8,
  },

  card: {
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 16,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 6,
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Italic',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  value: {
    fontSize: 14,
    lineHeight: 20,
    color: '#111827',
    fontFamily: 'Nunito-SemiBoldItalic',
  },
})
