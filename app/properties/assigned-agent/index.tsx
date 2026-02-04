import { ProfileIcons } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button, { ButtonType } from '@/components/ui/button'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, Dimensions, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
const { width } = Dimensions.get('window')
type MenuItem = {
  icon: string
  title: string
  value: string
  onPress: () => void
}

export default function AssignedAgent() {
  const router = useRouter()
  const userData = {
    name: 'Roberts Junior',
    profile_image:
      'https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png',
    phone: "+ 971 50 XXX XXXX"
  }
  const MenuItemData = [
    {
      icon: ProfileIcons.user,
      title: 'Designation',
      value: "Project Manager",
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

  const handleCallAgent = React.useCallback(async () => {
    if (!userData?.phone) {
      Alert.alert('Phone number unavailable')
      return
    }

    const phoneNumber = userData.phone.replace(/\s+/g, '')
    const telUrl = `tel:${phoneNumber}`

    try {
      const supported = await Linking.canOpenURL(telUrl)
      if (supported) {
        await Linking.openURL(telUrl)
      } else {
        Alert.alert('Unable to place call', 'Your device cannot make this call.')
      }
    } catch (error) {
      Alert.alert('Call failed', 'Please try again later.')
    }
  }, [userData?.phone])

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title="Assigned Agent"
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
      <View style={{ flexDirection: "row", marginTop: 12, gap: 10, width: width - 20, marginHorizontal: "auto" }}>
        <Button
          style={{ flex: 1, borderRadius: 12 }}
          icon={<Ionicons name="call-outline" size={20} color="#B08D59" />}
          type={ButtonType.OUTLINE}
          onPress={handleCallAgent}
          title='Call now'
        />
        <Button
          style={{ flex: 1, borderRadius: 12 }}
          icon={<Ionicons name="chatbubbles-outline" size={20} color="#fff" />}
          type={ButtonType.PRIMARY}
          onPress={() => router.push("/chat/1")}
          title='Message'
        />
      </View>
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
    fontFamily: 'Nunito-SemiBold',
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