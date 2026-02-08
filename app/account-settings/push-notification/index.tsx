import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import {
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export default function PushNotificationSettings() {
  const router = useRouter()
  const [enabled, setEnabled] = useState(true)
  const { t } = useTranslation()

  const progress = useSharedValue(1)

  useEffect(() => {
    progress.value = withTiming(enabled ? 1 : 0, { duration: 250 })
  }, [enabled])


  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={t('account_settings.push_notification')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />

      <Card style={styles.cardWrapper}>
        <Pressable
          onPress={() => setEnabled((prev) => !prev)}
          style={styles.row}
        >
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>
              {t('push_notification.title')}
            </Text>

            <Text
              style={[styles.cardDescription]}
            >
              {t('push_notification.description')}
            </Text>
          </View>

          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: '#E5E7EB', true: '#D4B785' }}
            thumbColor="#FFFFFF"
          />
        </Pressable>
      </Card>
    </SafeAreaViewWithSpacing>
  )
}
const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textContainer: {
    flex: 1,
    // paddingRight: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBoldItalic',
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 10,
    fontFamily: 'Montserrat-Italic',
    color: '#6B7280',
    lineHeight: 18,
  },
})
