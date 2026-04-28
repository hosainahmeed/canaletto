
import { useGetMyPropertyImageQuery } from '@/app/redux/services/siteUpdateApis'
import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import FilterHeader from '@/components/share/FilterHeader'
import HelpSection from '@/components/share/HelpSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { SiteUpdateType } from '@/types/siteUpdateType'
import { formatDate } from '@/utils/dateUtils'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Dimensions, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'

const { width } = Dimensions.get('window')

export default function SiteUpdates() {
  const router = useRouter()
  const { id } = useLocalSearchParams() as { id: string }
  const { data: siteUpdateData, isLoading, refetch } = useGetMyPropertyImageQuery(id, { skip: !id })
  const siteUpdates: SiteUpdateType[] = useMemo(() => siteUpdateData?.data?.data || [], [siteUpdateData])
  const renderHeader = () => {
    return (
      <FilterHeader
        filterOptions={[
          { label: 'Last 24 Hours', value: '1d' },
          { label: 'Last 3 Days', value: '3d' },
          { label: 'Last Week', value: '1w' },
          { label: 'Last Month', value: '1m' },
        ]}
      />
    )
  }
  const renderSiteUpdateItem = useCallback(({ item }: { item: SiteUpdateType }) => {
    const handleViewImages = () => {
      router.push({
        pathname: "/properties/site-updates/construction-images/[id]",
        params: { id: item?.id }
      })
    }

    return (
      <Card style={styles.fileCard}>
        <View style={styles.fileLeft}>
          <Image source={item?.image ? { uri: item.image } : IMAGE.image_placeholder} style={styles.pdfIcon} />
          <View>
            <Text style={styles.fileTitle}>
              {item?.location || 'Site Update'}
            </Text>
            <Text style={styles.fileDate}>
              {formatDate(item?.createdAt)}
            </Text>
            {/* <Text style={styles.propertyName}>
              {item?.property?.name}
            </Text> */}
          </View>
        </View>
        <View style={styles.fileActions}>
          <Pressable onPress={handleViewImages}>
            <Image source={IMAGE.eye} style={styles.actionIcon} />
          </Pressable>
        </View>
      </Card>
    )
  }, [router])
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


      <FlatList
        data={siteUpdates}
        keyExtractor={(item) => item?.id}
        renderItem={renderSiteUpdateItem}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#A855F7"
            colors={["#A855F7"]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <Text style={styles.emptyText}>No site updates found</Text>
          </View>
        )}
      />

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
    fontStyle: "italic"
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
    width: 28,
    height: 28,
  },
  propertyName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
})