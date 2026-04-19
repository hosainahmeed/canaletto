import { FileItem } from '@/types'
import * as FileSystem from 'expo-file-system/legacy'
import React from 'react'
import { Alert, Platform, Share } from 'react-native'

interface UseFileDownloadReturn {
  downloadingKey: string | null
  setDownloadingKey: (key: string | null) => void
  downloadFile: (file: FileItem, fileName: string, key: string) => Promise<void>
}

export const useFileDownload = (): UseFileDownloadReturn => {
  const [downloadingKey, setDownloadingKey] = React.useState<string | null>(null)

  const downloadFile = React.useCallback(async (file: FileItem, fileName: string, key: string) => {
    try {
      setDownloadingKey(key)
      const tempDir = FileSystem.cacheDirectory ?? FileSystem.documentDirectory
      if (!tempDir) {
        throw new Error('No writable directory available')
      }

      const tempFileUri = `${tempDir}${file.file_url.split('/').pop() || fileName}`
      const { uri: downloadedUri } = await FileSystem.downloadAsync(file.file_url, tempFileUri)

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
      setDownloadingKey(null)
    }
  }, [])

  return {
    downloadingKey,
    setDownloadingKey,
    downloadFile
  }
}
