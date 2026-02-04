import React from 'react'
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function ({
  visible,
  onClose,
  selectedValue,
  setSelectedValue,
  filterOptions
}: Props & { selectedValue: string; setSelectedValue: (value: string) => void; filterOptions: { label: string; value: string }[] }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => { }}>
          {filterOptions.map((item, index) => (
            <ActionButton
              key={item.value}
              label={item.label}
              value={item.value}
              selected={selectedValue}
              onPress={() => setSelectedValue(item.value)}
              isLast={index === filterOptions.length - 1}
            />
          ))}
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.cancelBtn,
              pressed && Platform.OS === 'ios' && styles.pressed,
            ]}
          >
            <Text style={styles.cancelText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  )

}

const ActionButton = ({
  label,
  value,
  onPress,
  selected,
  isLast,
}: {
  label: string
  value: string
  selected: string
  isLast: boolean
  onPress: () => void
}) => (
  <Pressable
    onPress={onPress}
    android_ripple={{ color: '#00000010' }}
    style={({ pressed }) => [
      styles.actionRow,
      !isLast && styles.borderBottom,
      pressed && Platform.OS === 'ios' && styles.pressed,
    ]}
  >
    <Text style={styles.actionText}>{label}</Text>
    <View
      style={[
        styles.radio,
        selected === value && styles.radioSelected,
      ]}
    />
  </Pressable>
)


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    justifyContent: 'space-between',
  },

  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },

  radio: {
    width: 12,
    height: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#666666',
  },

  radioSelected: {
    backgroundColor: '#666666',
  },

  cancelBtn: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },

  cancelText: {
    fontSize: 15,
    color: '#EF4444',
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
  },

  pressed: {
    opacity: 0.6,
  },
})
