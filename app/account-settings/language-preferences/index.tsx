import { IMAGE } from '@/assets/images/image.index'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button, { ButtonType } from '@/components/ui/button'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')

type Language = 'English' | 'German'

export default function LanguagePreferences() {
  const router = useRouter()
  const [selectedLanguage, setSelectedLanguage] =
    React.useState<Language>('English')

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title="Language Preferences"
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />

      <LanguageItem
        title="English"
        icon={IMAGE.en}
        active={selectedLanguage === 'English'}
        onPress={() => setSelectedLanguage('English')}
      />

      <LanguageItem
        title="German"
        icon={IMAGE.gr}
        active={selectedLanguage === 'German'}
        onPress={() => setSelectedLanguage('German')}
      />

      <Button
        style={styles.button}
        type={ButtonType.PRIMARY}
        title="Switch Language"
        onPress={() => {
          // persist language here
        }}
      />
    </SafeAreaViewWithSpacing>
  )
}

function LanguageItem({
  title,
  icon,
  active,
  onPress,
}: {
  title: string
  icon: any
  active: boolean
  onPress: () => void
}) {
  const scale = useSharedValue(active ? 1 : 0)

  React.useEffect(() => {
    scale.value = withTiming(active ? 1 : 0, { duration: 220 })
  }, [active])

  const animatedDot = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }))

  const animatedCard = useAnimatedStyle(() => ({
    backgroundColor: active
      ? 'rgba(212, 183, 133, 0.18)'
      : '#FFFFFF',
    borderColor: active ? '#D4B785' : '#E5E7EB',
  }))

  return (
    <Animated.View style={[styles.cardWrapper, animatedCard]}>
      <Pressable onPress={onPress} style={styles.row}>
        <View style={styles.left}>
          <Image source={icon} style={styles.menuIcon} />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>

        <View style={styles.radioOuter}>
          <Animated.View style={[styles.radioInner, animatedDot]} />
        </View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBoldItalic',
    color: '#111827',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#D4B785',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D4B785',
  },
  button: {
    width: width - 24,
    marginHorizontal: 'auto',
    marginTop: 20,
    borderRadius: 14,
  },
})
