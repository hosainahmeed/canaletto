import { IMAGE } from '@/assets/images/image.index'
import { Image } from 'expo-image'
import React from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
const { width: screenWidth } = Dimensions.get("window")
export default function UserProfileHeader() {
  const Userdata = {
    img: "https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png",
    name: "Roberts Junior",

  }

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View style={styles.avatarWrapper}>
          <Image style={styles.avatar} source={{ uri: Userdata.img }} />
        </View>
        <View>
          <Text style={styles.userName}>{Userdata.name}</Text>
          <Text style={styles.welcomeText}>Welcome to CSW </Text>
        </View>
      </View>
      <Pressable
        style={styles.notificationButton}
        onPress={() => {
          // Handle notification press
        }}
      >
        <Image style={styles.notificationIcon} source={IMAGE.notification_bing} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth - 20,
    marginHorizontal: "auto",
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    justifyContent: 'space-between'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    overflow: "hidden",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#DDDDDD"
  },
  avatar: {
    width: "100%",
    height: "100%"
  },
  userName: {
    fontFamily: 'Montserrat-SemiBoldItalic',
    fontSize: 18,
  },
  welcomeText: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 14,
  },
  notificationButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 1000,
    borderColor: "#DDDDDD"
  },
  notificationIcon: {
    width: 24,
    height: 24,
  }
})