import { useUploadFileMutation } from '@/app/redux/services/uploadApis'
import { getFileType } from './getFileType'
import { getMimeType } from './getMimeType'

const uploadFile = async (uri: string) => {
  const formData = new FormData()
  const [uploadFileMutation, { isLoading: isUploading }] = useUploadFileMutation()

  const fileTypeKey = getFileType(uri)

  formData.append(fileTypeKey, {
    uri,
    name: `upload.${uri.split('.').pop()}`,
    type: getMimeType(uri),
  } as any)

  try {
    const res = await uploadFileMutation(formData).unwrap()
    console.log('Upload success:', res)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

export default { UploadFile: uploadFile }
