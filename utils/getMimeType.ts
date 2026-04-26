export const getMimeType = (uri: string) => {
  const ext = uri.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'mp4':
      return 'video/mp4'
    case 'mov':
      return 'video/quicktime'
    default:
      return 'application/octet-stream'
  }
}