import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import {
  Alert, Linking, Modal, Platform, Pressable,
  StyleSheet,
  Text
} from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
  onImageSelected: (uri: string) => void
}

export default function ImagePickerModal({
  visible,
  onClose,
  onImageSelected,
}: Props) {
  const [hasCamera, setHasCamera] = useState(true)
  const [isCheckingPermission, setIsCheckingPermission] = useState(false)

  useEffect(() => {
    checkCameraAvailability()
  }, [])

  const checkCameraAvailability = async () => {
    try {
      const result = await ImagePicker.getCameraPermissionsAsync()
      setHasCamera(result.granted !== false)
    } catch (error) {
      console.log('Camera not available:', error)
      setHasCamera(false)
    }
  }

  const showPermissionAlert = (title: string, message: string, settingsAction?: () => void) => {
    Alert.alert(
      title,
      message,
      settingsAction
        ? [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: settingsAction },
        ]
        : [{ text: 'OK', style: 'default' }]
    )
  }

  const requestCameraPermission = async () => {
    try {
      setIsCheckingPermission(true)
      const { status } = await ImagePicker.requestCameraPermissionsAsync()

      if (status === 'granted') {
        launchCamera()
      } else if (status === 'denied') {
        showPermissionAlert(
          'Camera Permission Required',
          'Please grant camera permission to take photos. You can enable this in Settings.',
          () => Linking.openSettings()
        )
      }
    } catch (error) {
      console.error('Camera permission error:', error)
      showPermissionAlert(
        'Camera Error',
        'Unable to access camera. The device may not have a camera or there was an error.'
      )
    } finally {
      setIsCheckingPermission(false)
    }
  }

  const requestGalleryPermission = async () => {
    try {
      setIsCheckingPermission(true)
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (status === 'granted') {
        launchImageLibrary()
      } else if (status === 'denied') {
        showPermissionAlert(
          'Gallery Permission Required',
          'Please grant gallery permission to select photos. You can enable this in Settings.',
          () => Linking.openSettings()
        )
      }
    } catch (error) {
      console.error('Gallery permission error:', error)
      showPermissionAlert(
        'Gallery Error',
        'Unable to access gallery. Please try again later.'
      )
    } finally {
      setIsCheckingPermission(false)
    }
  }

  const launchCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      })

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri)
        onClose()
      }
    } catch (error) {
      console.error('Camera launch error:', error)
      showPermissionAlert(
        'Camera Error',
        'Failed to launch camera. The device may not have a camera.'
      )
    }
  }

  const launchImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      })

      if (!result.canceled && result.assets[0]) {
        onImageSelected(result.assets[0].uri)
        onClose()
      }
    } catch (error) {
      console.error('Gallery launch error:', error)
      showPermissionAlert(
        'Gallery Error',
        'Failed to open gallery. Please try again.'
      )
    }
  }

  const handleCameraPress = () => {
    if (!hasCamera) {
      showPermissionAlert(
        'Camera Not Available',
        'This device does not have a camera or the camera is not available.'
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
        <Pressable style={styles.sheet} onPress={() => { }}>
          <Text style={styles.title}>Update Profile Picture</Text>

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

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.cancelBtn,
              pressed && Platform.OS === 'ios' && styles.pressed,
            ]}
          >
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
}: {
  icon: any
  label: string
  onPress: () => void
  disabled?: boolean
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    android_ripple={{ color: '#00000010' }}
    style={({ pressed }) => [
      styles.actionRow,
      disabled && styles.disabledAction,
      pressed && Platform.OS === 'ios' && !disabled && styles.pressed,
    ]}
  >
    <Ionicons
      name={icon}
      size={22}
      color={disabled ? '#9CA3AF' : '#D4B785'}
    />
    <Text style={[styles.actionText, disabled && styles.disabledText]}>{label}</Text>
  </Pressable>
)

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  sheet: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
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
