export const getFileType = (uri: string) => {
  const ext = uri.split('.').pop()?.toLowerCase()

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
    return 'chat_images'
  } else if (['mp4', 'mov', 'avi', 'mkv'].includes(ext || '')) {
    return 'chat_videos'
  } else {
    return 'chat_files'
  }
}