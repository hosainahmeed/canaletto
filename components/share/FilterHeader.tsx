import { IMAGE } from '@/assets/images/image.index'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import { Dimensions, Pressable, StyleSheet, TextInput, View } from 'react-native'
import FilterModal from './FilterModal'
const { width: screenWidth } = Dimensions.get('window')


export default function FilterHeader({ filterOptions }: { filterOptions: { label: string; value: string }[] }) {
  const [selectedValue, setSelectedValue] = useState<string>('')
  const [isVisable, setIsVisable] = useState<boolean>(false)
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        placeholder="Search by word"
      />
      <Pressable style={styles.filterIconContainer} onPress={() => setIsVisable(true)}>
        <Image source={IMAGE.filter_icon} style={styles.filterIcon} />
      </Pressable>
      <FilterModal
        filterOptions={filterOptions}
        visible={isVisable}
        onClose={() => setIsVisable(false)}
        selectedValue={selectedValue}
        setSelectedValue={(value) => setSelectedValue(value)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: "auto",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: screenWidth - 20
  },
  filterIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterIcon: {
    width: 24,
    height: 24,
  },

  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
})