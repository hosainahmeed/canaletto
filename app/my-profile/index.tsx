import { ProfileIcons } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button from '@/components/ui/button'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

type MenuItem = {
  icon: string
  title: string
  value: string
  onPress: () => void
}

export default function MyProfile() {
  const router = useRouter()
  const userData = {
    name: 'Roberts Junior',
    profile_image:
      'https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png',
  }
  const MenuItemData = [
    {
      icon: ProfileIcons.user,
      title: 'Name',
      value: "Roberts Junior ",
      onPress: () => console.log('Name pressed'),
    },
    {
      icon: ProfileIcons.mail,
      title: 'Email',
      value: "robert @canaletto.com ",
      onPress: () => console.log('Email pressed'),
    },
    {
      icon: ProfileIcons.phone,
      title: 'Phone / WhatsApp',
      value: "+ 971 50 XXX XXXX",
      onPress: () => console.log('Phone pressed'),
    },
  ]

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title="My Profile"
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={styles.headerTitle}
      />
      <ProfileHeader user={userData} />
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
      <Button style={styles.updateButton} iconPosition='right' icon={<Image source={ProfileIcons.edit} style={{ width: 16, height: 16 }} />} onPress={() => router.push('/my-profile/update-profile')} title='Update profile ' />
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
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Montserrat-SemiBoldItalic',
  },
  updateButton: {
    borderRadius: 10,
    marginHorizontal: 12,
    marginVertical: 12,
  },
  arrow: {
    width: 12,
    height: 12,
  },
})
