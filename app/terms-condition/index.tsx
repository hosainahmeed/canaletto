import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Dimensions, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import RenderHTML from 'react-native-render-html'
import { useGetTermsAndConditionsQuery } from '../redux/services/settingApis'

const { width } = Dimensions.get('window')

export default function PrivacyPolicy() {
  const router = useRouter()
  const { data: termsConditionData, isLoading: isTermsDataLoading, refetch } = useGetTermsAndConditionsQuery(undefined)
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
        title="Terms & Condition"
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={isTermsDataLoading} onRefresh={refetch} />}
        style={{ flex: 1, paddingHorizontal: 16 }}>
        {
          isTermsDataLoading ?
            <View style={{ flex: 1 }}>
              <ActivityIndicator size="small" />
            </View> :
            <RenderHTML
              contentWidth={width}
              source={{
                html: termsConditionData?.data?.description
              }}
            />
        }
      </ScrollView>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({})