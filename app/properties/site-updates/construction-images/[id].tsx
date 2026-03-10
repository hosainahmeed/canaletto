import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Dimensions, FlatList, Modal, Pressable, StyleSheet, View } from 'react-native'

const { width } = Dimensions.get('window')

const imageCategories = [
  { id: '1', image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/460058113/FT/OP/CN/8782269/tiles-work-service.jpg' },
  { id: '2', image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/460058113/FT/OP/CN/8782269/tiles-work-service.jpg' },
  { id: '3', image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/460058113/FT/OP/CN/8782269/tiles-work-service.jpg' },
  { id: '4', image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/460058113/FT/OP/CN/8782269/tiles-work-service.jpg' },
  { id: '5', image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/460058113/FT/OP/CN/8782269/tiles-work-service.jpg' },
  { id: '6', image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/460058113/FT/OP/CN/8782269/tiles-work-service.jpg' },
  { id: '7', image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/460058113/FT/OP/CN/8782269/tiles-work-service.jpg' },
  { id: '8', image: 'https://5.imimg.com/data5/SELLER/Default/2024/10/460058113/FT/OP/CN/8782269/tiles-work-service.jpg' },
]

export default function ConstructionImages() {
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
  }

  const renderGridItem = ({ item, index }: { item: typeof imageCategories[0]; index: number }) => (
    <Pressable style={styles.imageContainer} onPress={() => openImageModal(index)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      {/* <View style={styles.overlay} /> */}
    </Pressable>
  )

  const renderModalItem = ({ item }: { item: typeof imageCategories[0] }) => (
    <View style={styles.modalImageContainer}>
      <Image source={{ uri: item.image }} style={styles.modalImage} />
    </View>
  )

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
      <FlatList
        data={imageCategories}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
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
            data={imageCategories}
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
    borderColor: "#dadada",
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
})