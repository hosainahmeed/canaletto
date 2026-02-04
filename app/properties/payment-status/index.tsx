import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import EmptyCard from '@/components/share/EmptyCard'
import HelpSection from '@/components/share/HelpSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import * as FileSystem from 'expo-file-system/legacy'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'


type Invoice = {
  pdfLink: string
  date: string
  status: 'pending' | 'paid'
}

const pendingInvoices: Invoice[] = [
  {
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '2025-10-15',
    status: 'pending',
  },
  {
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '2025-10-16',
    status: 'pending',
  },
  {
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '2025-10-17',
    status: 'pending',
  },
]

const paidInvoices: Invoice[] = [
  {
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '2025-10-15',
    status: 'paid',
  },
  {
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '2025-10-16',
    status: 'paid',
  },
  {
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '2025-10-17',
    status: 'paid',
  },
]


const { width } = Dimensions.get('window')
const TAB_WRAPPER_WIDTH = width - 20
const TAB_GAP = 10
const TAB_BUTTON_WIDTH = (TAB_WRAPPER_WIDTH - TAB_GAP) / 2
export default function PaymentStaus() {
  const router = useRouter()
  const [activeButton, setActiveButton] = React.useState<'pending' | 'Paid'>('pending')
  const [downloadingKey, setDownloadingKey] = React.useState<string | null>(null)
  const TABS = ['pending', 'Paid'] as const

  const indicatorX = useSharedValue(0)

  const handleTabChange = (tab: 'pending' | 'Paid', index: number) => {
    setActiveButton(tab)
    indicatorX.value = withTiming(index * (TAB_BUTTON_WIDTH + TAB_GAP), { duration: 250 })
  }

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }))

  const handleViewInvoice = React.useCallback((invoice: Invoice, index: number) => {
    router.push({
      pathname: '/properties/files/PdfViewer',
      params: { pdfLink: invoice.pdfLink, title: `Invoice ${index + 1}` },
    })
  }, [router])

  const handleDownloadInvoice = React.useCallback(async (invoice: Invoice, index: number) => {
    try {
      const invoiceKey = `${invoice.pdfLink}-${invoice.date}-${index}`
      setDownloadingKey(invoiceKey)
      const fileName = `invoice-${index + 1}.pdf`

      const tempDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory
      if (!tempDir) {
        throw new Error('No writable directory available')
      }

      const tempFileUri = `${tempDir}${invoice.pdfLink.split('/').pop() || fileName}`
      const { uri: downloadedUri } = await FileSystem.downloadAsync(invoice.pdfLink, tempFileUri)

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

        if (!permissions.granted) {
          Alert.alert('Permission needed', 'Please choose a folder to save the invoice.')
          await FileSystem.deleteAsync(tempFileUri, { idempotent: true })
          return
        }

        const directoryUri = permissions.directoryUri
        const targetUri = await FileSystem.StorageAccessFramework.createFileAsync(
          directoryUri,
          fileName,
          'application/pdf'
        )

        const base64 = await FileSystem.readAsStringAsync(downloadedUri, {
          encoding: FileSystem.EncodingType.Base64,
        })

        await FileSystem.StorageAccessFramework.writeAsStringAsync(targetUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        })

        await FileSystem.deleteAsync(tempFileUri, { idempotent: true })
        Alert.alert('Download complete', 'Saved to the folder you selected.')
        return
      }

      const docsDir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory
      if (!docsDir) {
        throw new Error('No documents directory available')
      }

      const finalDir = docsDir.endsWith('/') ? docsDir : `${docsDir}/`
      const finalPath = `${finalDir}${fileName}`
      await FileSystem.copyAsync({ from: downloadedUri, to: finalPath })

      await Share.share({ url: finalPath, message: `Invoice saved: ${fileName}` })

      await FileSystem.deleteAsync(tempFileUri, { idempotent: true })
    } catch (error) {
      console.error('Invoice download failed', error)
      Alert.alert('Download failed', 'Please check your connection and try again.')
    } finally {
      setDownloadingKey(null)
    }
  }, [])

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title="Payment Status"
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />

      <View style={styles.tabWrapper}>
        <Animated.View style={[styles.tabIndicator, indicatorStyle]} />

        {TABS.map((tab, index) => {
          const isActive = activeButton === tab
          return (
            <Pressable
              key={tab}
              style={[
                styles.tabButton,
                activeButton !== tab && styles.deActiveTabButton,
              ]}
              onPress={() => handleTabChange(tab, index)}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {activeButton === 'pending' ? (
        <InvoiceList
          data={pendingInvoices}
          emptyIcon={IMAGE.emptyGreen}
          emptyColor="#22C55E"
          emptyTitle="No pending payment invoice available"
          onViewInvoice={handleViewInvoice}
          onDownloadInvoice={handleDownloadInvoice}
          downloadingKey={downloadingKey}
        />
      ) : (
        <InvoiceList
          data={paidInvoices}
          emptyIcon={IMAGE.emptyPurple}
          emptyColor="#A855F7"
          emptyTitle="No paid payment invoice available"
          onViewInvoice={handleViewInvoice}
          onDownloadInvoice={handleDownloadInvoice}
          downloadingKey={downloadingKey}
        />
      )}

    </SafeAreaViewWithSpacing>
  )
}

const InvoiceList = ({
  data,
  emptyIcon,
  emptyColor,
  emptyTitle,
  onViewInvoice,
  onDownloadInvoice,
  downloadingKey,
}: {
  data: Invoice[]
  emptyIcon: any
  emptyColor: string
  emptyTitle: string
  onViewInvoice: (invoice: Invoice, index: number) => void
  onDownloadInvoice: (invoice: Invoice, index: number) => void
  downloadingKey: string | null
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.pdfLink + item.date + item.status}
      contentContainerStyle={{ paddingVertical: 12 }}
      renderItem={({ item, index }) => {
        const invoiceKey = `${item.pdfLink}-${item.date}-${index}`

        return (
          <Card style={styles.invoiceCard}>
            <View style={styles.invoiceLeft}>
              <Image source={IMAGE.pdfIcon} style={styles.pdfIcon} />
              <View>
                <Text style={styles.invoiceTitle}>
                  Invoice {index + 1}.pdf
                </Text>
                <Text style={styles.invoiceDate}>
                  Due Date: {item.date}
                </Text>
                <Text
                  style={[
                    styles.invoiceStatus,
                    { color: item.status === 'paid' ? '#22C55E' : '#F59E0B' },
                  ]}
                >
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.invoiceActions}>
              <Pressable onPress={() => onViewInvoice(item, index)}>
                <Image source={IMAGE.eye} style={styles.actionIcon} />
              </Pressable>
              <Pressable onPress={() => onDownloadInvoice(item, index)}>
                {downloadingKey !== invoiceKey ? (
                  <Image
                    source={IMAGE.download}
                    style={styles.actionIcon}
                  />
                ) : (
                  <View style={[styles.downloadingText, { justifyContent: "center", alignItems: "center" }]}>
                    <ActivityIndicator size="small" />
                  </View>
                )}
              </Pressable>
            </View>
          </Card>
        )
      }}
      ListFooterComponent={<HelpSection />}
      ListEmptyComponent={
        <EmptyCard
          icon={emptyIcon}
          color={emptyColor}
          title={emptyTitle}
        />
      }
    />
  )
}

const styles = StyleSheet.create({
  tabWrapper: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: "auto",
    width: TAB_WRAPPER_WIDTH,
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },

  tabButton: {
    width: TAB_BUTTON_WIDTH,
    paddingVertical: 14,
    alignItems: 'center',
    zIndex: 2,
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B08D59',
  },

  activeTabText: {
    color: '#FFFFFF',
  },
  deActiveTabButton: {
    borderWidth: 1,
    borderColor: '#D4B785',
    borderRadius: 12,
    backgroundColor: 'rgba(212, 183, 133, 0.3)',
  },
  tabIndicator: {
    position: 'absolute',
    width: TAB_BUTTON_WIDTH,
    height: '100%',
    backgroundColor: '#D4B785',
    borderRadius: 12,
  },

  invoiceCard: {
    width: width - 20,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    marginTop: 12
  },

  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  pdfIcon: {
    width: 44,
    height: 44,
  },

  invoiceTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  invoiceDate: {
    fontSize: 11,
    color: '#6B7280',
  },

  invoiceStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  invoiceActions: {
    flexDirection: 'row',
    gap: 12,
  },

  actionIcon: {
    width: 32,
    height: 32,
  },

  downloadingText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
})
