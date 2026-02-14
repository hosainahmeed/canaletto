import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import EmptyCard from '@/components/share/EmptyCard'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'

const { width: screenWidth } = Dimensions.get('window')

type NotificationItem = {
  id: string
  title: string
  time: string
  isRead: boolean
}

// const NOTIFICATIONS: NotificationItem[] = []
const NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Upcoming Payment Reminder',
    time: '18 March 2026 · 09:00 AM',
    isRead: false,
  },
  {
    id: '2',
    title: 'Severe Weather Alert',
    time: '17 March 2026 · 08:15 PM',
    isRead: true,
  },
]
export default function NotificationScreen() {
  const router = useRouter()
  const { t } = useTranslation()

  const renderNotificationItem: ListRenderItem<NotificationItem> = ({ item }) => (
    <Card
      style={[
        styles.notificationItem,
        item.isRead ? styles.readNotification : styles.unreadNotification,
      ]}
    >
      <Image source={IMAGE.moon} style={styles.notificationIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        {/* <Text style={styles.notificationDescription}>{item.description}</Text> */}
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </Card>
  )

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
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic', fontFamily: 'Montserrat-Italic' }}
        title={t("page_title.notifications")}
      />
      <FlatList
        data={NOTIFICATIONS}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          // <View style={styles.emptyState}>
          //   <Image source={IMAGE.notification_bing} style={styles.emptyIcon} />
          //   <Text style={styles.emptyTitle}>You are all caught up</Text>
          //   <Text style={styles.emptyDescription}>
          //     New alerts will appear here. Stay tuned!
          //   </Text>
          // </View>
          <EmptyCard icon={IMAGE.notification_bing} title='No Notifications' iconStyle={{ width: 40, height: 40 }} color="#D4B785" backgroundColor="#F9F7F2" />
        }
      />
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 24,
    width: screenWidth - 20,
    marginHorizontal: 'auto',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
  },
  notificationIcon: {
    width: 44,
    height: 44,
  },
  notificationTitle: {
    fontFamily: 'Nunito-Italic',
    fontSize: 16,
    color: '#1F2933',
  },
  notificationDescription: {
    fontSize: 12,
    fontFamily: 'Nunito-Italic',
    color: '#4B5563',
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 10,
    fontFamily: 'Nunito-Italic',
    color: '#9CA3AF',
    marginTop: 8,
  },
  unreadNotification: {
    backgroundColor: '#D4B78520',
    borderColor: '#D4B78555',
    borderWidth: 1,
  },
  readNotification: {
    backgroundColor: '#F9F7F2',
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 8,
  },
  emptyIcon: {
    width: 48,
    height: 48,
  },
  emptyTitle: {
    fontFamily: 'Montserrat-Italic',
    fontWeight: '700',
    fontSize: 16,
    color: '#1F2933',
  },
  emptyDescription: {
    fontSize: 12,
    fontFamily: 'Nunito-Italic',
    color: '#6B7280',
    textAlign: 'center',
  },
})