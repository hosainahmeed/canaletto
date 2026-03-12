import { ProfileIcons } from '@/assets/images/image.index'
import Avatar from '@/components/avatar/Avatar'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import ShimmerEffect from '@/components/shimmer/ShimmerEffect'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button from '@/components/ui/button'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useGetMyProfileQuery } from '../redux/services/userApis'

type MenuItem = {
  icon: string
  title: string
  value: string
  onPress: () => void
}

export default function MyProfile() {
  const router = useRouter()
  const { t } = useTranslation()
  const { data, isLoading } = useGetMyProfileQuery(undefined)
  const userData = {
    name: data?.data?.name || 'Roberts Junior',
    profile_image: data?.data?.profile_image,
  }
  const MenuItemData = [
    {
      icon: ProfileIcons.user,
      title: t('my_profile.name'),
      value: data?.data?.name || "----",
      onPress: () => console.log('Name pressed'),
    },
    {
      icon: ProfileIcons.mail,
      title: t('my_profile.email'),
      value: data?.data?.email || "----",
      onPress: () => console.log('Email pressed'),
    },
    {
      icon: ProfileIcons.phone,
      title: t('my_profile.phone'),
      value: data?.data?.phone || "+ XXX XX XXX XXXX",
      onPress: () => console.log('Phone pressed'),
    },
  ]

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={t('page_title.my_profile')}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={styles.headerTitle}
      />
      <ProfileHeader user={userData} isLoading={isLoading} />
      {
        MenuItemData.map((item, index) => (
          <MenuItemRow
            key={index}
            icon={item.icon}
            title={item.title}
            value={item.value}
            onPress={item.onPress}
          />
        ))
      }
      <Button style={styles.updateButton} iconPosition='right' icon={<Image source={ProfileIcons.edit} style={{ width: 16, height: 16 }} />} onPress={() => router.push('/my-profile/update-profile')} title={t('action.update_profile')} />
    </SafeAreaViewWithSpacing>
  )
}
const ProfileHeader = ({ user, isLoading }: any) => {
  return (
    <View style={styles.profileHeader}>
      {isLoading ? (
        <ShimmerEffect style={styles.avatarWrapper}>
          <View style={styles.avatarShimmer} />
        </ShimmerEffect>
      ) : (
        <Avatar
          source={{ uri: user.profile_image }}
          name={user.name}
          size={100}
          fontSize={36}
          style={styles.avatarWrapper}
        />
      )}
      {isLoading ? (
        <ShimmerEffect style={styles.nameShimmer}>
          <View style={styles.nameShimmerInner} />
        </ShimmerEffect>
      ) : (
        <Text style={styles.userName}>{user.name}</Text>
      )}
    </View>
  )
}

const MenuItemRow = ({ icon, title, value, onPress }: MenuItem) => {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.menuCard}>
        <View style={styles.menuLeft}>
          <Image source={icon} style={styles.menuIcon} />
          <View>
            <Text style={styles.menuText}>{title}</Text>
            <Text style={styles.menuValue}>{value}</Text>
          </View>
        </View>
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
    borderColor: 'rgba(221,221,221,0.9)',
    backgroundColor: 'rgba(212,183,133,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarShimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 26,
  },

  nameShimmer: {
    height: 24,
    width: 150,
    alignSelf: 'center',
    marginTop: 8,
  },

  nameShimmerInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
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
    width: 48,
    height: 48,
  },

  menuText: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontFamily: 'Montserrat-SemiBoldItalic',
    color: '#B0B0B0',
    fontWeight: '500',
  },
  menuValue: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Montserrat-SemiBoldItalic',
  },
  updateButton: {
    borderRadius: 10,
    marginHorizontal: 12,
    marginVertical: 12,
    height: 48
  },
  arrow: {
    width: 12,
    height: 12,
  },
})

