import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import RenderHTML from 'react-native-render-html'
import { useGetPrivacyPolicyQuery } from '../redux/services/settingApis'

const { width } = Dimensions.get('window')

export default function TermsCondition() {
  const router = useRouter()
  const { data: privacyPolicyData, isLoading: isLoadingPrivacyPolicy, refetch } = useGetPrivacyPolicyQuery(undefined)
  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.BOTTOM, SafeAreaEdge.TOP]}>
      <BackHeaderButton
        onPress={() => {
          if (router.canGoBack()) {
            router.back()
          } else {
            router.replace('/')
          }
        }}
        titleFontWeight={800}
        titleFontFamily='Montserrat-Italic'
        titleStyle={{ fontStyle: 'italic', fontFamily: 'Montserrat-Italic' }}
        title="Privacy policy"
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isLoadingPrivacyPolicy} onRefresh={refetch} />}
        style={{ flex: 1, paddingHorizontal: 16 }}>
        {isLoadingPrivacyPolicy ?
          <View style={{ flex: 1 }}>
            <ActivityIndicator size="small" />
          </View>
          : <RenderHTML
            contentWidth={width}
            source={{
              html: privacyPolicyData?.data?.description
            }}
          />}
      </ScrollView>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({})