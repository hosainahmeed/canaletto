import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'

import { ProfileIcons } from '@/assets/images/image.index'
import CustomInput from '@/components/CustomInput'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import ImagePickerModal from '@/components/share/ImagePickerModal'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function UpdateProfile() {
  const router = useRouter()
  const { t } = useTranslation()
  const [imageModalVisible, setImageModalVisible] = useState(false)

  const userData = {
    name: 'Roberts Junior',
    phoneNumber: '+971 50 XXX XXXX',
    profile_image:
      'https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png',
  }

  const [fullName, setFullName] = useState(userData.name)
  const [phone, setPhone] = useState(userData.phoneNumber)
  const [imageUri, setImageUri] = useState<string | null>(
    userData.profile_image
  )
  const [imageFile, setImageFile] = useState<File | null>(null)

  /* ---------------- IMAGE PICKERS ---------------- */

  const pickFromGallery = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })

    if (!result.canceled) {
      handleImage(result.assets[0].uri)
    }
  }

  const takePhoto = async () => {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') return

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    })

    if (!result.canceled) {
      handleImage(result.assets[0].uri)
    }
  }

  const handleImage = async (uri: string) => {
    setImageUri(uri)

    const file = {
      uri,
      name: `profile_${Date.now()}.jpg`,
      type: 'image/jpeg',
    } as unknown as File

    setImageFile(file)
  }

  const openImageOptions = () => {
    setImageModalVisible(true)
  }

  const onSave = () => {
    const payload = {
      name: fullName,
      phone,
      avatar: imageFile,
    }

    console.log('UPDATE PROFILE PAYLOAD:', payload)
  }

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={t('page_title.update_profile')}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* PROFILE IMAGE */}
        <Pressable onPress={openImageOptions}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: imageUri || '' }} style={styles.avatar} />
              <View style={styles.cameraIconWrapper}>
                <Image style={styles.cameraIcon} source={ProfileIcons.camera} />
              </View>
            </View>
          </View>
        </Pressable>

        {/* INPUTS */}
        <CustomInput
          label={t('my_profile.name')}
          placeholder={t('my_profile.name')}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />

        <CustomInput
          label={t('my_profile.phone')}
          placeholder={t('my_profile.phone')}
          value={phone}
          onChangeText={setPhone}
        />

        <Button
          style={styles.saveButton}
          title={t('action.save_change')}
          onPress={onSave}
        />
      </ScrollView>
      <ImagePickerModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        onCamera={takePhoto}
        onGallery={pickFromGallery}
      />

    </SafeAreaViewWithSpacing>
  )
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },

  profileHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },

  avatarWrapper: {
    width: 100,
    height: 100,
    position: "relative",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(221,221,221,0.6)',
    backgroundColor: 'rgba(212,183,133,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
  },

  saveButton: {
    borderRadius: 10,
    marginTop: 16,
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: '#D4B785',
    borderRadius: 4,
    pointerEvents: "none",
    padding: 4,
    elevation: 2
  },
  cameraIcon: {
    width: 16,
    height: 16,
  },
})

