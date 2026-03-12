import { useGetMyProfileQuery } from '@/app/redux/services/userApis'

export interface UserDetails {
  name: string
  phone: string
  profile_image: string | null
  email?: string
  id?: string
}

export interface UseUserDetailsReturn {
  userDetails: UserDetails | null
  isLoading: boolean
  error: any
  refetch: () => void
  isSuccess: boolean
  isError: boolean
}

export const useUserDetails = (): UseUserDetailsReturn => {
  const {
    data,
    isLoading,
    error,
    refetch,
    isSuccess,
    isError
  } = useGetMyProfileQuery(undefined)

  const userDetails = data?.data || null

  return {
    userDetails,
    isLoading,
    error,
    refetch,
    isSuccess,
    isError
  }
}

export default useUserDetails