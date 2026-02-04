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


type PropertyFile = {
  id: string
  name: string
  pdfLink: string
  date: string
}

const propertyFiles: PropertyFile[] = [
  {
    id: 'agreement',
    name: 'Agreement.pdf',
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '08:14 AM 25 Jan 2025',
  },
  {
    id: 'receipt',
    name: 'Receipt.pdf',
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '08:14 AM 26 Jan 2025',
  },
  {
    id: 'share',
    name: 'Share.pdf',
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '08:14 AM 27 Jan 2025',
  },
]




const { width } = Dimensions.get('window')

export default function PropertyFiles() {
  const router = useRouter()
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null)

  const handleViewFile = (file: PropertyFile) => {
    router.push({
      pathname: '/properties/files/PdfViewer',
      params: { pdfLink: file.pdfLink, title: file.name },
    });
  };



  const handleDownloadFile = React.useCallback(async (file: PropertyFile) => {
    try {
      setDownloadingId(file.id)
      const fileName = `file-${file.id}.pdf`

      const tempDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory
      if (!tempDir) {
        throw new Error('No writable directory available')
      }

      const tempFileUri = `${tempDir}${file.pdfLink.split('/').pop() || fileName}`
      const { uri: downloadedUri } = await FileSystem.downloadAsync(file.pdfLink, tempFileUri)

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

        if (!permissions.granted) {
          Alert.alert('Permission needed', 'Please choose a folder to save the file.')
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

      await Share.share({ url: finalPath, message: `File saved: ${fileName}` })

      await FileSystem.deleteAsync(tempFileUri, { idempotent: true })
    } catch (error) {
      console.error('File download failed', error)
      Alert.alert('Download failed', 'Please check your connection and try again.')
    } finally {
      setDownloadingId(null)
    }
  }, [])

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title="Property Files"
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />
      <PropertyFileList
        data={propertyFiles}
        emptyIcon={IMAGE.empty}
        emptyColor="#3B82F6"
        emptyTitle="No files available"
        onViewFile={handleViewFile}
        onDownloadFile={handleDownloadFile}
        downloadingId={downloadingId}
      />

    </SafeAreaViewWithSpacing>
  )
}

const PropertyFileList = ({
  data,
  emptyIcon,
  emptyColor,
  emptyTitle,
  onViewFile,
  onDownloadFile,
  downloadingId,
}: {
  data: PropertyFile[]
  emptyIcon: any
  emptyColor: string
  emptyTitle: string
  onViewFile: (file: PropertyFile) => void
  onDownloadFile: (file: PropertyFile) => void
  downloadingId: string | null
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item?.pdfLink + item?.date}
      contentContainerStyle={{ paddingVertical: 12 }}
      renderItem={({ item, index }) => (
        <Card style={styles.fileCard}>
          <View style={styles.fileLeft}>
            <Image source={IMAGE.pdfIcon} style={styles.pdfIcon} />
            <View>
              <Text style={styles.fileTitle}>
                {item?.name}
              </Text>
              <Text style={styles.fileDate}>
                {item?.date}
              </Text>
            </View>
          </View>

          <View style={styles.fileActions}>
            <Pressable onPress={() => onViewFile(item)}>
              <Image source={IMAGE.eye} style={styles.actionIcon} />
            </Pressable>
            <Pressable onPress={() => onDownloadFile(item)}>
              {downloadingId !== item?.id ? (
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
      )}
      ListHeaderComponentStyle={{ marginTop: 12 }}
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
  fileCard: {
    width: width - 20,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    marginTop: 12
  },

  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  pdfIcon: {
    width: 44,
    height: 44,
  },

  fileTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  fileDate: {
    fontSize: 11,
    color: '#6B7280',
  },


  fileActions: {
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
