import { useUploadFileMutation } from '@/app/redux/services/uploadApis'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
  onUploadComplete?: (data: any) => void
  keyName?: string
  optimasticUpload?: boolean
  showLocalPreview?: (fileData: any) => void
}

export default function ImagePickerModal({
  visible,
  onClose,
  onUploadComplete,
  keyName,
  optimasticUpload = false,
  showLocalPreview
}: Props) {
  const [hasCamera, setHasCamera] = useState(true)
  const [isCheckingPermission, setIsCheckingPermission] = useState(false)

  const [uploadFileMutation, { isLoading }] = useUploadFileMutation()

  useEffect(() => {
    checkCameraAvailability()
  }, [])

  const checkCameraAvailability = async () => {
    try {
      const result = await ImagePicker.getCameraPermissionsAsync()
      setHasCamera(result.granted !== false)
    } catch {
      setHasCamera(false)
    }
  }

  const showPermissionAlert = (
    title: string,
    message: string,
    settingsAction?: () => void
  ) => {
    Alert.alert(
      title,
      message,
      settingsAction
        ? [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: settingsAction },
        ]
        : [{ text: 'OK' }]
    )
  }

  const getFileTypeKey = (uri: string) => {
    const ext = uri.split('.').pop()?.toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return 'chat_images'
    } else if (['mp4', 'mov', 'avi', 'mkv'].includes(ext || '')) {
      return 'chat_videos'
    } else {
      return 'chat_files'
    }
  }

  const getMimeType = (uri: string) => {
    const ext = uri.split('.').pop()?.toLowerCase()

    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'png':
        return 'image/png'
      case 'mp4':
        return 'video/mp4'
      case 'mov':
        return 'video/quicktime'
      default:
        return 'application/octet-stream'
    }
  }

  const uploadFile = async (uri: string) => {
    try {
      const formData = new FormData()

      const finalKey = keyName || getFileTypeKey(uri)
      const fileData = {
        uri,
        name: `file.${uri.split('.').pop()}`,
        type: getMimeType(uri),
      } as any
      showLocalPreview?.(uri)
      onClose()
      if (!optimasticUpload) {
        onUploadComplete?.(fileData)
        return
      }

      formData.append(finalKey, fileData)
      const res = await uploadFileMutation(formData).unwrap()
      onUploadComplete?.(res)
      // onClose()
    } catch (error) {
      console.error('Upload error:', error)
      Alert.alert('Upload Failed', 'Something went wrong while uploading.')
    }
  }

  const requestCameraPermission = async () => {
    try {
      setIsCheckingPermission(true)
      const { status } =
        await ImagePicker.requestCameraPermissionsAsync()

      if (status === 'granted') {
        launchCamera()
      } else {
        showPermissionAlert(
          'Camera Permission Required',
          'Enable camera access from settings.',
          () => Linking.openSettings()
        )
      }
    } finally {
      setIsCheckingPermission(false)
    }
  }

  const requestGalleryPermission = async () => {
    try {
      setIsCheckingPermission(true)
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status === 'granted') {
        launchGallery()
      } else {
        showPermissionAlert(
          'Gallery Permission Required',
          'Enable gallery access from settings.',
          () => Linking.openSettings()
        )
      }
    } finally {
      setIsCheckingPermission(false)
    }
  }

  const launchCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images", "videos"],
        quality: 1,
        allowsEditing: true,
      })

      if (!result.canceled && result.assets?.[0]) {
        uploadFile(result.assets[0].uri)
      }
    } catch {
      showPermissionAlert('Camera Error', 'Failed to open camera.')
    }
  }

  const launchGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        quality: 1,
        allowsEditing: true,
        selectionLimit: 5,
        videoQuality: 1,
      })

      if (!result.canceled && result.assets?.[0]) {
        uploadFile(result.assets[0].uri)
      }
    } catch {
      showPermissionAlert('Gallery Error', 'Failed to open gallery.')
    }
  }

  const handleCameraPress = () => {
    if (!hasCamera) {
      showPermissionAlert(
        'No Camera',
        'This device does not support camera.'
      )
      return
    }
    requestCameraPermission()
  }

  const handleGalleryPress = () => {
    requestGalleryPermission()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <Text style={styles.title}>Upload File</Text>

          <ActionButton
            icon="camera-outline"
            label="Take Photo"
            onPress={handleCameraPress}
            disabled={!hasCamera || isCheckingPermission}
          />

          <ActionButton
            icon="image-outline"
            label="Choose from Gallery"
            onPress={handleGalleryPress}
            disabled={isCheckingPermission}
          />

          <Pressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const ActionButton = ({
  icon,
  label,
  onPress,
  disabled = false,
}: any) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={({ pressed }) => [
      styles.actionRow,
      disabled && styles.disabledAction,
      pressed && Platform.OS === 'ios' && styles.pressed,
    ]}
  >
    <Ionicons
      name={icon}
      size={22}
      color={disabled ? '#9CA3AF' : '#D4B785'}
    />
    <Text style={[styles.actionText, disabled && styles.disabledText]}>
      {label}
    </Text>
  </Pressable>
)

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#6B7280',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  cancelText: {
    fontSize: 15,
    color: '#EF4444',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.6,
  },
  disabledAction: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#9CA3AF',
  },
})