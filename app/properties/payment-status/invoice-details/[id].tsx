import { useDeleteInvoiceMutation, useGetInvoidByIdQuery } from '@/app/redux/services/invoiceApis'
import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import MessageModal from '@/components/share/MessageModal'
import { useToast } from '@/components/toast/useToast'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button, { ButtonSize, ButtonType } from '@/components/ui/button'
import { Invoice } from '@/types'
import { convertStatus } from '@/utils/convertStatus'
import { formatDate } from '@/utils/dateUtils'
import { AlertSquareIcon, Delete02FreeIcons } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import * as FileSystem from 'expo-file-system/legacy'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Alert, Dimensions, FlatList, Modal, Platform, Pressable, Share, StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'

const { width } = Dimensions.get('window')

export default function InvoiceDetails() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: invoiceData, isLoading } = useGetInvoidByIdQuery(id as string, { skip: !id })
  const [deleteInvoice] = useDeleteInvoiceMutation()
  const [downloading, setDownloading] = React.useState(false)
  const [showPdfModal, setShowPdfModal] = React.useState(false)
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = React.useState(false)
  const toast = useToast()

  const handleModalDownload = async () => {
    if (!selectedInvoice) return

    try {
      setDownloading(true)
      const fileName = `invoice-${selectedInvoice?.id}.pdf`

      const tempDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory
      if (!tempDir) {
        throw new Error('No writable directory available')
      }

      const tempFileUri = `${tempDir}${selectedInvoice?.document_url.split('/').pop() || fileName}`
      const { uri: downloadedUri } = await FileSystem.downloadAsync(selectedInvoice?.document_url, tempFileUri)

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

        if (!permissions.granted) {
          Alert.alert('Permission needed', 'Please choose a folder to save invoice.')
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
        Alert.alert('Download complete', 'Saved to folder you selected.')
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
      setDownloading(false)
    }
  }

  const handleViewInvoice = (invoiceItem: Invoice) => {
    setSelectedInvoice(invoiceItem)
    setShowPdfModal(true)
  }

  if (isLoading) {
    return (
      <SafeAreaViewWithSpacing>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4B785" />
          <Text style={styles.loadingText}>Loading invoice...</Text>
        </View>
      </SafeAreaViewWithSpacing>
    )
  }

  if (!invoiceData?.data) {
    return (
      <SafeAreaViewWithSpacing>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invoice not found</Text>
        </View>
      </SafeAreaViewWithSpacing>
    )
  }
  const cardData = [
    {
      title: "Invoice Date",
      value: formatDate(invoiceData?.data?.invoiceDate)
    },
    {
      title: "Due Date",
      value: formatDate(invoiceData?.data?.dueDate)
    },
    {
      title: "Invoice Amount",
      value: invoiceData?.data?.amount
    },
    {
      title: "Payment Status",
      value: convertStatus(invoiceData?.data?.status)
    },
    {
      title: "Payment Date",
      value: formatDate(invoiceData?.data?.paymentDate)
    }
  ]

  const handleDeleteInvoice = async () => {
    try {
      const result = await deleteInvoice(invoiceData?.data?.id).unwrap()
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to delete invoice')
      }
      toast.success(result?.message || 'Invoice deleted successfully')
      setIsVisible(false)
      router.back()
    } catch (error: any) {
      console.error('Delete invoice failed', error)
      const errorMessage = error?.data?.message || error?.message || 'Failed to delete invoice'
      toast.error(errorMessage)
      setIsVisible(false)
    } finally {
      setIsVisible(false)
    }
  }
  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={t('page_title.invoice_details')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />

      <View style={styles.container}>
        {/* Invoice Info Card */}
        <FlatList
          data={cardData || []}
          renderItem={({ item }) => {
            return (
              <Card style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoText}>
                    <Text style={styles.invoiceTitle}>{item.title}</Text>
                    <Text style={styles.invoiceValue}>{item.value}</Text>
                  </View>
                </View>
              </Card>
            )
          }}
          ListFooterComponent={() => {
            return (
              <View style={{ flex: 1, flexDirection: 'column', gap: 12 }}>
                <Card style={styles.invoiceCard}>
                  <View style={styles.invoiceLeft}>
                    <Image source={IMAGE.pdfIcon} style={styles.pdfIcon} />
                    <View>
                      <Text numberOfLines={1} style={styles.invoiceTitle}>
                        Invoice {invoiceData?.data?.id?.slice(-4)}.pdf
                      </Text>
                      <Text numberOfLines={1} style={styles.invoiceDate}>
                        Due Date: {formatDate(invoiceData?.data?.invoiceDate)}
                      </Text>
                      <Text
                        style={[
                          styles.invoiceStatus,
                          { color: invoiceData?.data?.status === 'paid' ? '#22C55E' : '#F59E0B' },
                        ]}
                      >
                        {invoiceData?.data?.status?.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.invoiceActions}>
                    <Pressable onPress={() => handleViewInvoice(invoiceData?.data)}>
                      <Image source={IMAGE.eye} style={styles.actionIcon} />
                    </Pressable>
                    <Pressable onPress={() => handleModalDownload()}>
                      {downloading ? (
                        <View style={[styles.downloadingText, { justifyContent: "center", alignItems: "center" }]}>
                          <ActivityIndicator size="small" />
                        </View>
                      ) : (
                        <Image
                          source={IMAGE.download}
                          style={styles.actionIcon}
                        />
                      )}
                    </Pressable>
                  </View>
                </Card>
                <Button
                  onPress={() => setIsVisible(true)}
                  icon={<HugeiconsIcon icon={Delete02FreeIcons} color={"#FFF"} size={24} />}
                  type={ButtonType.DANGER} size={ButtonSize.LARGE} title={t('action.delete_this_invoice')} />
                <View style={{ height: 20 }} />
              </View>
            )
          }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
        <MessageModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          onConfirm={() => {
            handleDeleteInvoice()

          }}
          actionType='danger'
          message={{
            icon: <HugeiconsIcon color="red" size={48} icon={AlertSquareIcon} />,
            title: 'Delete Invoice',
            message: 'Are you sure you want to delete this invoice?',
            confirmText: 'Delete',
          }}
        />
        {/* PDF Modal */}
        <Modal
          visible={showPdfModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowPdfModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowPdfModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
              <Text style={styles.modalTitle}>Invoice PDF</Text>
              <Pressable
                style={styles.modalDownloadButton}
                onPress={handleModalDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.modalDownloadText}>Download</Text>
                )}
              </Pressable>
            </View>

            {selectedInvoice && (
              <WebView
                source={{ uri: selectedInvoice?.document_url }}
                style={styles.modalWebView}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={styles.webViewLoading}>
                    <ActivityIndicator size="large" color="#D4B785" />
                    <Text style={styles.webViewLoadingText}>Loading PDF...</Text>
                  </View>
                )}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent
                  console.warn('WebView error: ', nativeEvent)
                  Alert.alert(
                    'Error',
                    'Failed to load PDF. You can try downloading it instead.'
                  )
                }}
              />
            )}
          </View>
        </Modal>
      </View>

    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  infoCard: {
    marginTop: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pdfIcon: {
    width: 44,
    height: 44,
  },
  infoText: {
    flex: 1,
  },
  invoiceTitle: {
    fontSize: 12,
    color: "#B0B0B0",
    fontFamily: "Nunito-MediumItalic"
  },
  invoiceValue: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
    fontFamily: "Nunito-MediumItalic"
  },
  pdfCard: {
    flex: 1,
    marginTop: 16,
    minHeight: 400,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 8,
  },
  webViewLoadingText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 24,
  },
  downloadButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#D4B785',
  },
  shareButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D4B785',
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

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 50,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  modalDownloadButton: {
    backgroundColor: '#D4B785',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDownloadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalWebView: {
    flex: 1,
  },
})
