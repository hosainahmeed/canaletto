import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text
} from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
  onCamera: () => void
  onGallery: () => void
}

export default function ImagePickerModal({
  visible,
  onClose,
  onCamera,
  onGallery,
}: Props) {
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
            onPress={() => {
              onClose()
              onCamera()
            }}
          />

          <ActionButton
            icon="image-outline"
            label="Choose from Gallery"
            onPress={() => {
              onClose()
              onGallery()
            }}
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
}: {
  icon: any
  label: string
  onPress: () => void
}) => (
  <Pressable
    onPress={onPress}
    android_ripple={{ color: '#00000010' }}
    style={({ pressed }) => [
      styles.actionRow,
      pressed && Platform.OS === 'ios' && styles.pressed,
    ]}
  >
    <Ionicons name={icon} size={22} color="#D4B785" />
    <Text style={styles.actionText}>{label}</Text>
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
})
