import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native'

import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing, {
  SafeAreaEdge,
} from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useLegalAndCompanyInfoQuery } from '../redux/services/settingApis'

type LegalItem = {
  title: string
  value: string
}

export default function LegalCompanyInfo() {
  const router = useRouter()
  const { data, isLoading, refetch } = useLegalAndCompanyInfoQuery(undefined)

  const companyLegalData: LegalItem[] = data?.data ? [
    {
      title: 'Company Name',
      value: data?.data?.name || 'N/A',
    },
    {
      title: 'Registered Office Address',
      value: data?.data?.officeAddress || 'N/A',
    },
    {
      title: 'Trade License Number',
      value: data?.data?.tradeLicenseNumber || 'N/A',
    },
    {
      title: 'Issuing Authority',
      value: data?.data?.issuingAuthority || 'N/A',
    },
    {
      title: 'Business Activity',
      value: data?.data?.businessActivity || 'N/A',
    },
    {
      title: 'Phone Number',
      value: data?.data?.phoneNumber || 'N/A',
    },
    {
      title: 'Official Website',
      value: data?.data?.websiteLink || 'N/A',
    },
  ] : []

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
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
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
