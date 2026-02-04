import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

type MenuItem = {
  icon: string
  title: string
  onPress: () => void
}

export default function AccountSettings() {
  const router = useRouter()
  const pushRouting = (path: any) => {
    if (router) {
      router.push(path)
    }
  }


  const items: MenuItem[] = [
    { icon: IMAGE.lock, title: 'Change Password', onPress: () => pushRouting('/account-settings/change-password') },
    { icon: IMAGE.bell, title: 'Push Notification', onPress: () => pushRouting('/account-settings/push-notification') },
    { icon: IMAGE.language, title: 'Language preferences', onPress: () => pushRouting('/account-settings/language-preferences') },
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
        title="Account Settings"
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <MenuItemRow {...item} />}
      />
    </SafeAreaViewWithSpacing>
  )
}
const MenuItemRow = ({ icon, title, onPress }: MenuItem) => {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.menuCard}>
        <View style={styles.menuLeft}>
          <Image source={icon} style={styles.menuIcon} />
          <Text style={styles.menuText}>{title}</Text>
        </View>

        <Image source={IMAGE.next} style={styles.arrow} />
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    marginBottom: 8,
    fontFamily: 'Montserrat-SemiBoldItalic',
  },

  listContent: {
    paddingBottom: 24,
  },

  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 8,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  menuIcon: {
    width: 32,
    height: 32,
  },

  menuText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Montserrat-SemiBoldItalic',
  },
  arrow: {
    width: 12,
    height: 12,
  },
})