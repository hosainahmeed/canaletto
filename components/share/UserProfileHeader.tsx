import { useGetMyProfileQuery } from '@/app/redux/services/userApis'
import { IMAGE } from '@/assets/images/image.index'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'

const { width: screenWidth } = Dimensions.get("window")

export default React.memo(function UserProfileHeader() {

  const router = useRouter()
  const { t } = useTranslation()
  const { data, isLoading } = useGetMyProfileQuery(undefined)

  const name = data?.data?.name || ""
  const profileImage = data?.data?.profile_image
  const firstLetter = name?.charAt(0)?.toUpperCase()

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.userInfo}>
          {/* Avatar Skeleton */}
          <View style={styles.avatarSkeleton} />
          <View>
            <View style={styles.nameSkeleton} />
            <View style={styles.textSkeleton} />
          </View>
        </View>
        <View style={styles.notificationSkeleton} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {data ?
        <Pressable onPress={() => router.push("/Profile")}>
          <View style={styles.userInfo}>
            <View style={styles.avatarWrapper}>
              {profileImage ? (
                <Image
                  style={styles.avatar}
                  source={{ uri: profileImage }}
                />
              ) : (
                <View style={[styles.avatarFallback, { backgroundColor: "#B08D59" }]}>
                  <Text style={styles.avatarLetter}>{firstLetter}</Text>
                </View>
              )}
            </View>
            <View>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.welcomeText}>
                {t("message.welcome_to_csw")}
              </Text>
            </View>
          </View>
        </Pressable>
        :
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 2 }}>
          <View style={[styles.avatarWrapper, { backgroundColor: "#B08D59" }]}>
            <Image
              style={[styles.avatar, { borderRadius: 12 }]}
              source={IMAGE.logo}
            />
          </View>
          <Text numberOfLines={1} style={[styles.userName, { fontSize: 18 }]}>Welcome to CSW</Text>
        </View>
      }

      <Pressable
        style={styles.notificationButton}
        onPress={() => router.push("/notifications")}
      >
        <Image
          style={styles.notificationIcon}
          source={IMAGE.notification_bing}
        />
      </Pressable>
    </View>
  )
})

const styles = StyleSheet.create({

  container: {
    width: screenWidth - 20,
    marginHorizontal: "auto",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },

  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#DDDDDD"
  },

  avatar: {
    width: "100%",
    height: "100%"
  },

  avatarFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarLetter: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  },

  userName: {
    fontFamily: 'Montserrat-SemiBoldItalic',
    fontSize: 18
  },

  welcomeText: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 14
  },

  notificationButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 1000,
    borderColor: "#DDDDDD"
  },

  notificationIcon: {
    width: 24,
    height: 24
  },

  /* Skeleton Styles */

  avatarSkeleton: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: "#E5E5E5"
  },

  nameSkeleton: {
    width: 120,
    height: 14,
    borderRadius: 6,
    backgroundColor: "#E5E5E5",
    marginBottom: 6
  },

  textSkeleton: {
    width: 90,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E5E5"
  },

  notificationSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "#E5E5E5"
  }

})