import { useGetMyPropertyFilesQuery } from '@/app/redux/services/propertyFileApis'
import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import EmptyCard from '@/components/share/EmptyCard'
import HelpSection from '@/components/share/HelpSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import * as FileSystem from 'expo-file-system/legacy'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { ActivityIndicator, Alert, Dimensions, FlatList, Platform, Pressable, RefreshControl, Share, StyleSheet, Text, View } from 'react-native'






const { width } = Dimensions.get('window')

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const day = date.getDate();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${formattedHours}:${formattedMinutes} ${ampm} ${day} ${month} ${year}`;
};

interface FileData {
  id: string;
  propertyId: string;
  managerId: string;
  name: string;
  file_url: string;
  createdAt: string;
  updatedAt: string;
  property: {
    name: string;
  };
  manager: {
    name: string;
    profile_image: string;
  };
}

export default function PropertyFiles() {
  const { id } = useLocalSearchParams()
  const { data, isLoading, refetch } = useGetMyPropertyFilesQuery(id as string, { skip: !id })
  const propertyFileData: FileData[] = useMemo(() => data?.data?.data, [data])
  const router = useRouter()
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null)

  const handleViewFile = (file: FileData) => {
    router.push({
      pathname: '/properties/files/PdfViewer',
      params: { pdfLink: file?.file_url, title: file.name },
    });
  };



  const handleDownloadFile = React.useCallback(async (file: FileData) => {
    try {
      setDownloadingId(file.id)
      const fileName = `file-${file.id}.pdf`

      const tempDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory
      if (!tempDir) {
        throw new Error('No writable directory available')
      }

      const tempFileUri = `${tempDir}${file?.file_url.split('/').pop() || fileName}`
      const { uri: downloadedUri } = await FileSystem.downloadAsync(file?.file_url, tempFileUri)

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
        data={propertyFileData}
        emptyIcon={IMAGE.empty}
        isLoading={isLoading}
        refetch={refetch}
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
  isLoading,
  refetch
}: {
  data: FileData[]
  emptyIcon: any
  emptyColor: string
  emptyTitle: string
  onViewFile: (file: FileData) => void
  onDownloadFile: (file: FileData) => void
  downloadingId: string | null,
  isLoading: boolean,
  refetch: any
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item?.id}
      contentContainerStyle={{ paddingVertical: 12 }}
      renderItem={({ item }) => (
        <Card style={styles.fileCard}>
          <View style={styles.fileLeft}>
            <Image source={IMAGE.pdfIcon} style={styles.pdfIcon} />
            <View>
              <Text style={styles.fileTitle}>
                {item?.name}
              </Text>
              <Text style={styles.fileDate}>
                {formatDate(item?.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.fileActions}>
            <Pressable
              onPress={() => onViewFile(item)}
              disabled={!item?.file_url}
              style={!item?.file_url && styles.disabledButton}
            >
              <Image
                source={IMAGE.eye}
                style={[styles.actionIcon, !item?.file_url && styles.disabledIcon]}
              />
            </Pressable>
            <Pressable
              onPress={() => onDownloadFile(item)}
              disabled={!item?.file_url}
              style={!item?.file_url && styles.disabledButton}
            >
              {downloadingId !== item?.id ? (
                <Image
                  source={IMAGE.download}
                  style={[styles.actionIcon, !item?.file_url && styles.disabledIcon]}
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
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />}
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

  disabledButton: {
    opacity: 0.5,
  },

  disabledIcon: {
    opacity: 0.5,
  },
})
