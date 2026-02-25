import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import EmptyCard from '@/components/share/EmptyCard'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Tick, Trash } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Swipeable } from 'react-native-gesture-handler'

const { width: screenWidth } = Dimensions.get('window')

type NotificationItem = {
  id: string
  title: string
  time: string
  isRead: boolean
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
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

  const [notifications, setNotifications] =
    useState(INITIAL_NOTIFICATIONS)

  // ✅ keep only one swipe open
  const openedSwipeable = useRef<Swipeable | null>(null)

  const closeOpened = () => {
    openedSwipeable.current?.close()
    openedSwipeable.current = null
  }

  const handleDelete = (id: string) => {
    closeOpened()
    setNotifications(prev => prev.filter(i => i.id !== id))
  }

  const handleMarkRead = (id: string) => {
    closeOpened()
    setNotifications(prev =>
      prev.map(i =>
        i.id === id ? { ...i, isRead: true } : i,
      ),
    )
  }


  const renderRightActions = (item: NotificationItem) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.actionButton, styles.markRead]}
        onPress={() => handleMarkRead(item.id)}
      >
        <HugeiconsIcon icon={Tick} size={22} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.actionButton, styles.delete]}
        onPress={() => handleDelete(item.id)}
      >
        <HugeiconsIcon icon={Trash} size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  )

  const renderNotificationItem: ListRenderItem<NotificationItem> = ({
    item,
  }) => (
    <Swipeable
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      onSwipeableOpen={(direction, ref) => {
        if (openedSwipeable.current &&
          openedSwipeable.current !== ref) {
          openedSwipeable.current.close()
        }
        openedSwipeable.current = ref
      }}
      renderRightActions={() => renderRightActions(item)}
    >
      <Card
        style={[
          styles.notificationItem,
          item.isRead
            ? styles.readNotification
            : styles.unreadNotification,
        ]}
      >
        <Image source={IMAGE.moon} style={styles.notificationIcon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </Card>
    </Swipeable>
  )

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
        title={t('page_title.notifications')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
      />

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyCard
            icon={IMAGE.notification_bing}
            title="No Notifications"
            iconStyle={{ width: 40, height: 40 }}
            color="#D4B785"
            backgroundColor="#F9F7F2"
          />
        }
      />
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 24,
    width: screenWidth - 20,
    alignSelf: 'center',
  },

  notificationItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    overflow: 'hidden',
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

  notificationTime: {
    fontSize: 10,
    fontFamily: 'Nunito-Italic',
    color: '#9CA3AF',
    marginTop: 8,
  },

  unreadNotification: {
    backgroundColor: 'rgba(232, 225, 213, 1)',
    borderColor: '#D4B78555',
    borderWidth: 1,
  },

  readNotification: {
    backgroundColor: '#F9F7F2',
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },

  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderRadius: 8,
    marginLeft: 12,
    overflow: 'hidden',
    gap: 8,
  },

  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  markRead: {
    borderRadius: "100%",
    backgroundColor: '#D4B785',
  },

  delete: {
    borderRadius: "100%",
    backgroundColor: '#EF4444',
  },
})