import { useGetSinglePropertyImagesQuery } from '@/app/redux/services/siteUpdateApis'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { SiteUpdateType } from '@/types/siteUpdateType'
import { formatDate } from '@/utils/dateUtils'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { Dimensions, FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'

const { width } = Dimensions.get('window')


export default function ConstructionImages() {
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { id } = useLocalSearchParams() as { id: string }
  const { data: imagesData, isLoading: imagesLoading, refetch } = useGetSinglePropertyImagesQuery(id, { skip: !id })

  const siteUpdateData: SiteUpdateType | null = useMemo(() => imagesData?.data || null, [imagesData])
  const images = useMemo(() => {
    if (siteUpdateData?.image) {
      return [{ id: siteUpdateData.id, image: siteUpdateData.image }]
    }
    return []
  }, [siteUpdateData])


  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const renderGridItem = useCallback(({ item, index }: { item: { id: string; image: string }; index: number }) => (
    <Pressable style={styles.imageContainer} onPress={() => openImageModal(index)}>
      <Image source={{ uri: item.image }} style={styles.image} />
    </Pressable>
  ), [])

  const renderModalItem = useCallback(({ item }: { item: { id: string; image: string } }) => (
    <View style={styles.modalImageContainer}>
      <Image source={{ uri: item.image }} style={styles.modalImage} />
    </View>
  ), [])

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title="Construction Images"
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() => {
          if (router.canGoBack()) router.back()
          else router.replace('/')
        }}
      />

      {/* Site Update Details */}
      {siteUpdateData && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{siteUpdateData.name || 'Site Update'}</Text>
          <Text style={styles.detailsLocation}>Location : {siteUpdateData.location}</Text>
          <Text style={styles.detailsDate}>Date: {formatDate(siteUpdateData.createdAt)}</Text>
        </View>
      )}

      <FlatList
        data={images}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={imagesLoading}
            onRefresh={refetch}
            tintColor="#A855F7"
            colors={["#A855F7"]}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No images found</Text>
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
        presentationStyle="pageSheet"
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.closeButton} onPress={closeModal}>
            <View style={styles.closeButtonInner} >
              <IconSymbol name="xmark" size={24} color="#111" />
            </View>
          </Pressable>
          <FlatList
            data={images}
            renderItem={renderModalItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={selectedImageIndex}
            getItemLayout={(data, index) => ({
              length: Dimensions.get('window').width,
              offset: Dimensions.get('window').width * index,
              index,
            })}
          />
        </View>
      </Modal>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    opacity: 0.9,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  closeButtonInner: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB"
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    fontFamily: 'Montserrat-SemiBoldItalic',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  detailsLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  detailsDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
})