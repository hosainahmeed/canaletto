import { useGetSinglePropertyQuery } from '@/app/redux/services/propertyApis'
import { ProfileIcons } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button, { ButtonType } from '@/components/ui/button'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, Linking, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native'
const { width } = Dimensions.get('window')
type MenuItem = {
  icon: string
  title: string
  value: string
  onPress: () => void
}

export default function AssignedAgent() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { data: propertyData, isLoading, refetch } = useGetSinglePropertyQuery(id as string, { skip: !id })
  if (isLoading) {
    return (
      <SafeAreaViewWithSpacing>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={"small"} />
        </View>
      </SafeAreaViewWithSpacing>
    )
  }
  const userData = {
    name: propertyData?.data?.manager?.name || 'Roberts Junior',
    profile_image: propertyData?.data?.manager?.profile_image || '',
    phone: propertyData?.data?.manager?.phone || "+ 971 50 XXX XXXX",
    email: propertyData?.data?.manager?.email || "robert @canaletto.com",
  }
  const MenuItemData = [
    {
      icon: ProfileIcons.user,
      title: 'Designation',
      value: "Project Manager",
      onPress: () => { },
    },
    {
      icon: ProfileIcons.mail,
      title: 'Email',
      value: propertyData?.data?.manager?.email || "robert @canaletto.com ",
      onPress: () => { },
    },
    {
      icon: ProfileIcons.phone,
      title: 'Phone / WhatsApp',
      value: propertyData?.data?.manager?.phone || "+ 971 50 XXX XXXX",
      onPress: () => { },
    },
  ]

  const handleCallAgent = React.useCallback(async () => {
    if (!userData?.phone) {
      Alert.alert('Phone number unavailable')
      return
    }

    const phoneNumber = userData?.phone?.replace(/\s+/g, '')
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
      <FlatList
        data={MenuItemData}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListHeaderComponent={<ProfileHeader user={userData} />}
        ListFooterComponent={() => (
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
              // onPress={() => Linking.openURL(`https://mail.google.com/mail/?view=cm&fs=1&to=${userData?.email}`)}
              // title='Message'
              onPress={() => {
                router.push('/(tabs)/Support')
              }}
              title='Message'
            />
          </View>
        )}
        renderItem={({ item, index }) => (
          <MenuItemRow
            key={index}
            icon={item.icon}
            title={item.title}
            value={item.value}
            onPress={item.onPress}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />

    </SafeAreaViewWithSpacing>
  )
}
const ProfileHeader = ({ user }: any) => {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarWrapper}>
        {user?.profile_image ? <Image source={{ uri: user?.profile_image }} style={styles.avatar} /> : <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#B08D59' }}>{user?.name?.slice(0, 2).toUpperCase()}</Text>}
      </View>
      <Text style={styles.userName}>{user?.name}</Text>
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