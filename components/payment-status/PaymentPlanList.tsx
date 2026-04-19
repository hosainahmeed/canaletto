import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import EmptyCard from '@/components/share/EmptyCard'
import { FileActionButtons } from '@/components/ui/FileActionButtons'
import { PaymentPlan } from '@/types'
import { formatDate } from '@/utils/dateUtils'
import { Image } from 'expo-image'
import React from 'react'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'

const { width } = Dimensions.get('window')

export const PaymentPlanList = ({
  data,
  emptyIcon,
  emptyColor,
  emptyTitle,
  onViewInvoice,
  onDownloadInvoice,
  downloadingKey,
}: {
  data: PaymentPlan[]
  emptyIcon: any
  emptyColor: string
  emptyTitle: string
  onViewInvoice: (paymentPlan: PaymentPlan) => void
  onDownloadInvoice?: (paymentPlan: PaymentPlan, index: number) => void
  downloadingKey: string | null
}) => {
  return (
    <FlatList
      data={data || []}
      keyExtractor={(item) => item.id + item.createdAt}
      contentContainerStyle={{ paddingVertical: 12 }}
      renderItem={({ item, index }) => {
        return (
          <Card style={styles.paymentPlanCard}>
            <View style={styles.paymentPlanLeft}>
              <Image source={IMAGE.pdfIcon} style={styles.pdfIcon} />
              <View>
                <Text style={styles.paymentPlanTitle}>
                  {item.name}
                </Text>
                <Text style={styles.paymentPlanDate}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </View>

            <FileActionButtons
              file={item}
              index={index}
              downloadingKey={downloadingKey}
              onViewFile={(file) => onViewInvoice(file as PaymentPlan)}
              onDownloadFile={onDownloadInvoice ? (file, idx) => onDownloadInvoice(file as PaymentPlan, idx || 0) : undefined}
              showDownload={!!onDownloadInvoice}
            />
          </Card>
        )
      }}
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
  paymentPlanCard: {
    width: width - 20,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    marginTop: 12
  },

  paymentPlanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  pdfIcon: {
    width: 44,
    height: 44,
  },

  paymentPlanTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  paymentPlanDate: {
    fontSize: 11,
    color: '#6B7280',
  },

  paymentPlanStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  paymentPlanActions: {
    flexDirection: 'row',
    gap: 12,
  },

  actionIcon: {
    width: 32,
    height: 32,
  },

})