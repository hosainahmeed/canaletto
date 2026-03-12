import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'

import { useGetMyProfileQuery } from '@/app/redux/services/userApis'
import { ProfileIcons } from '@/assets/images/image.index'
import Avatar from '@/components/avatar/Avatar'
import CustomInput from '@/components/CustomInput'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import ImagePickerModal from '@/components/share/ImagePickerModal'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function UpdateProfile() {
  const router = useRouter()
  const { t } = useTranslation()
  const { data, isLoading } = useGetMyProfileQuery(undefined)
  const [imageModalVisible, setImageModalVisible] = useState(false)

  // Initialize form states with API data
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Update form states when API data loads
  useEffect(() => {
    if (data?.data) {
      setFullName(data.data.name || '')
      setPhone(data.data.phone || '')
      setImageUri(data.data.profile_image || null)
    }
  }, [data])

  const pickFromGallery = async () => {
    // This function is now handled by the ImagePickerModal component
    setImageModalVisible(true)
  }

  const takePhoto = async () => {
    // This function is now handled by the ImagePickerModal component
    setImageModalVisible(true)
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
      name: fullName.trim(),
      phone: phone.trim(),
      avatar: imageFile,
    }

    console.log('UPDATE PROFILE PAYLOAD:', payload)
    // TODO: Add API call to update profile
    // router.back()
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
              <Avatar
                source={imageUri ? { uri: imageUri } : undefined}
                name={fullName || 'User'}
                size={100}
                fontSize={36}
              />
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
        onImageSelected={handleImage}
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
    backgroundColor: 'rgba(212,183,133,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
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

