import { IMAGE } from '@/assets/images/image.index'
import { FileItem } from '@/types'
import { Image } from 'expo-image'
import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'

interface FileActionButtonsProps {
  file: FileItem
  index?: number
  downloadingKey: string | null
  onViewFile: (file: FileItem) => void
  onDownloadFile?: (file: FileItem, index?: number) => void
  showDownload?: boolean
}

export const FileActionButtons: React.FC<FileActionButtonsProps> = ({
  file,
  index = 0,
  downloadingKey,
  onViewFile,
  onDownloadFile,
  showDownload = true
}) => {
  const isDisabled = !file.file_url
  const fileKey = `${file.file_url}-${file.createdAt}-${index}`
  const isDownloading = downloadingKey === fileKey

  return (
    <View style={styles.fileActions}>
      <Pressable 
        onPress={() => onViewFile(file)}
        disabled={isDisabled}
        style={isDisabled && styles.disabledButton}
      >
        <Image 
          source={IMAGE.eye} 
          style={[styles.actionIcon, isDisabled && styles.disabledIcon]} 
        />
      </Pressable>
      
      {showDownload && onDownloadFile && (
        <Pressable 
          onPress={() => onDownloadFile(file, index)}
          disabled={isDisabled}
          style={isDisabled && styles.disabledButton}
        >
          {isDownloading ? (
            <View style={[styles.downloadingText, { justifyContent: "center", alignItems: "center" }]}>
              <ActivityIndicator size="small" />
            </View>
          ) : (
            <Image
              source={IMAGE.download}
              style={[styles.actionIcon, isDisabled && styles.disabledIcon]}
            />
          )}
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
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
