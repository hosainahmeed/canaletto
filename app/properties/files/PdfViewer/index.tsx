import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { ActivityIndicator, Alert, Dimensions, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes'

const { width, height } = Dimensions.get('window')

export default function PdfViewerScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ pdfLink?: string; title?: string }>()

  const pdfLink = params.pdfLink ?? ''
  const title = params.title ?? 'Document'

  const webSource = useMemo(() => {
    if (!pdfLink) return null

    if (Platform.OS === 'ios') {
      return { uri: pdfLink }
    }

    const encoded = encodeURIComponent(pdfLink)
    return { uri: `https://docs.google.com/gview?embedded=1&url=${encoded}` }
  }, [pdfLink])

  if (!pdfLink) {
    Alert.alert('Missing document', 'No PDF link was provided.')
    router.back()
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackHeaderButton title={title} onPress={() => router.back()} />
      {webSource ? (
        <WebView
          source={webSource}
          style={styles.pdf}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator size="large" color="#3B82F6" />
            </View>
          )}
          onError={(syntheticEvent: WebViewErrorEvent) => {
            console.error('PDF WebView error', syntheticEvent.nativeEvent)
            Alert.alert('Failed to open PDF', 'Please try again later.')
          }}
        />
      ) : (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdf: {
    flex: 1,
    width,
    height,
  },
  loaderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
