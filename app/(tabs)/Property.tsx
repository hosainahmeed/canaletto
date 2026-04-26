import PropertyCard, { Property } from '@/components/cards/PropertyCard'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import PropertyCardShimmer from '@/components/shimmer/PropertyCardShimmer'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, StyleSheet } from 'react-native'
import { useGetMyPropertyQuery } from '../redux/services/propertyApis'

export default function PropertyScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const { data, isLoading, refetch } = useGetMyPropertyQuery(undefined)

  const renderSmimmer = () => {
    return (
      <SafeAreaViewWithSpacing>
        <PropertyCardShimmer />
      </SafeAreaViewWithSpacing>
    )
  }

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
        titleStyle={{ fontStyle: 'italic', fontFamily: 'Montserrat-Italic' }}
        title={t('page_title.my_properties')}
      />
      <FlashList
        data={isLoading ? renderSmimmer : data?.data}
        renderItem={(item: { item: Property }) => <PropertyCard property={item?.item} />}
        keyExtractor={(item: Property) => item?.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.container}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />}
      />
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1
  }
})