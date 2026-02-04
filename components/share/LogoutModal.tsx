import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text
} from 'react-native'

type LogoutModalProps = {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutModal({
  visible,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={() => { }}>
          <Ionicons
            name="log-out-outline"
            size={44}
            color="#D4B785"
          />

          <Text style={styles.title}>Log out</Text>

          <Text style={styles.message}>
            Are you sure you want to log out?
          </Text>

          <Pressable
            onPress={onConfirm}
            android_ripple={{ color: '#ffffff33' }}
            style={({ pressed }) => [
              styles.confirmButton,
              pressed && Platform.OS === 'ios' && styles.pressed,
            ]}
          >
            <Text style={styles.confirmText}>Yes, log out</Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            android_ripple={{ color: '#00000010' }}
            style={({ pressed }) =>
              pressed && Platform.OS === 'ios' && styles.pressed
            }
          >
            <Text style={styles.cancelText}>
              Nah, just kidding
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  modal: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },

    // Android elevation
    elevation: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    color: '#D4B785',
  },

  message: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 20,
  },

  confirmButton: {
    width: '100%',
    backgroundColor: '#D4B785',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  cancelText: {
    fontSize: 14,
    color: '#6B7280',
  },

  pressed: {
    opacity: 0.7,
  },
})
