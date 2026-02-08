import { IMAGE, ProfileIcons } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import LogoutModal from '@/components/share/LogoutModal'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

type MenuItem = {
  icon: string
  title: string
  onPress: () => void
}

export default function Profile() {
  const router = useRouter()
  const { t } = useTranslation()
  const [isShowModal, setIsShowModal] = useState(false)

  const userData = {
    name: 'Roberts Junior',
    profile_image:
      'https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png',
  }

  const pushRouting = (path: any) => {
    if (router) {
      router.push(path)
    }
  }

  const logOutAction = () => {
    setIsShowModal(true)
  }

  const sections: { title?: string; data: MenuItem[] }[] = [
    {
      data: [
        { icon: ProfileIcons.profile, title: t('profile.my_profile'), onPress: () => pushRouting("/my-profile") },
        { icon: ProfileIcons.settings, title: t('profile.term'), onPress: () => pushRouting("/account-settings") },
      ],
    },
    {
      title: t('profile.more'),
      data: [
        { icon: ProfileIcons.terms, title: t('profile.terms_condition'), onPress: () => pushRouting("/terms-condition") },
        { icon: ProfileIcons.privacy, title: t('profile.privacy_policy'), onPress: () => pushRouting("/privacy-policy") },
        { icon: ProfileIcons.legal, title: t('profile.legal_company_info'), onPress: () => pushRouting("/legal-company-info") },
        { icon: ProfileIcons.logout, title: t('action.logout'), onPress: () => logOutAction() },
      ],
    },
  ]

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={t('page_title.profile')}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={styles.headerTitle}
      />

      <FlatList
        data={sections}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<ProfileHeader user={userData} />}
        renderItem={({ item }) => (
          <MenuSection title={item.title} data={item.data} />
        )}
      />
      <LogoutModal
        visible={isShowModal}
        onClose={() => setIsShowModal(false)}
        onConfirm={() => {
          setIsShowModal(false)
          router.replace('/(auth)/login')
        }}
      />
    </SafeAreaViewWithSpacing>
  )
}
const ProfileHeader = ({ user }: any) => {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: user.profile_image }} style={styles.avatar} />
      </View>

      <Text style={styles.userName}>{user.name}</Text>
    </View>
  )
}
const MenuSection = ({
  title,
  data,
}: {
  title?: string
  data: MenuItem[]
}) => {
  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}

      {data.map((item, index) => (
        <MenuItemRow key={index} {...item} />
      ))}
    </View>
  )
}

const MenuItemRow = ({ icon, title, onPress }: MenuItem) => {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.menuCard}>
        <View style={styles.menuLeft}>
          <Image source={icon} style={styles.menuIcon} />
          <Text numberOfLines={1} style={styles.menuText}>
            {title}
          </Text>
        </View>
        <Image source={IMAGE.next} style={styles.arrow} />
      </Card>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Italic',
  },

  listContent: {
    paddingBottom: 24,
  },

  profileHeader: {
    alignItems: 'center',
    marginVertical: 24,
  },

  avatarWrapper: {
    width: 100,
    height: 100,
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

  userName: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Montserrat-SemiBoldItalic',
  },

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
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Montserrat-SemiBoldItalic',
  },

  arrow: {
    width: 16,
    height: 16,
  },
})

