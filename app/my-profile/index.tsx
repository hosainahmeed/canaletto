import { ProfileIcons } from '@/assets/images/image.index'
import Avatar from '@/components/avatar/Avatar'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import ShimmerEffect from '@/components/shimmer/ShimmerEffect'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button from '@/components/ui/button'
import useUserDetails from '@/hooks/useUserDetails'
import { FlashList } from '@shopify/flash-list'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'

type MenuItem = {
  icon: string
  title: string
  value: string
  onPress: () => void
}

export default function MyProfile() {
  const router = useRouter()
  const { t } = useTranslation()
  const { userDetails, isLoading, refetch } = useUserDetails()

  const userData = {
    name: userDetails?.name || 'Roberts Junior',
    profile_image: userDetails?.profile_image,
  }

  const menuItems = useMemo(() => [
    {
      id: 'name',
      icon: ProfileIcons.user,
      title: t('my_profile.name'),
      value: userDetails?.name || "----",
      onPress: () => { },
    },
    {
      id: 'email',
      icon: ProfileIcons.mail,
      title: t('my_profile.email'),
      value: userDetails?.email || "----",
      onPress: () => { },
    },
    {
      id: 'phone',
      icon: ProfileIcons.phone,
      title: t('my_profile.phone'),
      value: userDetails?.phone || "+ XXX XX XXX XXXX",
      onPress: () => { },
    },
  ], [userDetails, t])

  const flashListData = useMemo(() => [
    { type: 'header', data: userData },
    ...menuItems.map(item => ({ type: 'menu', data: item })),
    { type: 'button', data: { onPress: () => router.push('/my-profile/update-profile') } }
  ], [userData, menuItems])

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return <ProfileHeader user={item.data} isLoading={isLoading} />
      case 'menu':
        return <MenuItemRow {...item.data} />
      case 'button':
        return (
          <Button
            style={styles.updateButton}
            iconPosition='right'
            icon={<Image source={ProfileIcons.edit} style={{ width: 16, height: 16 }} />}
            onPress={item.data.onPress}
            title={t('action.update_profile')}
          />
        )
      default:
        return null
    }
  }

  const getItemType = (item: any) => {
    return item.type
  }

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
      <FlashList
        data={flashListData}
        renderItem={renderItem}
        getItemType={getItemType}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
    <View style={styles.menuWrapper}>
      <Pressable onPress={onPress} style={styles.menuPressable}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Italic',
  },

  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },

  menuWrapper: {
    marginBottom: 8,
  },

  menuPressable: {
    width: '100%',
  },

  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 0,
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
    marginHorizontal: 0,
    marginTop: 12,
    height: 48
  },
  arrow: {
    width: 12,
    height: 12,
  },
})

