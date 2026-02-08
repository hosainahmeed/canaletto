import PropertyCard, { Property } from '@/components/cards/PropertyCard'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet } from 'react-native'

export default function PropertyScreen() {
  const router = useRouter()
  const { t } = useTranslation()
  const properties: Property[] = [
    {
      id: '1',
      name: 'Property 1',
      image:
        'https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg?metadata=true&quality=85',
      location: 'Location 1',
    },
    {
      id: '2',
      name: 'Property 2',
      image:
        'https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg?metadata=true&quality=85',
      location: 'Location 2',
    },
    {
      id: '3',
      name: 'Property 3',
      image:
        'https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg?metadata=true&quality=85',
      location: 'Location 3',
    },
  ]
  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        onPress={() => {
          if (router.canGoBack()) {
            router.back()
          } else {
            router.replace('/')
          }
        }}
        titleFontWeight={800}
        titleFontFamily='Montserrat-Italic'
        titleStyle={{ fontStyle: 'italic', fontFamily: 'Montserrat-Italic' }}
        title={t('page_title.my_properties')}
      />
      <FlatList
        data={properties}
        renderItem={(item) => <PropertyCard onViewPress={() => { }} property={item.item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({})