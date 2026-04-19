import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import EmptyCard from '@/components/share/EmptyCard'
import HelpSection from '@/components/share/HelpSection'
import { Invoice } from '@/types'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

const { width } = Dimensions.get('window')

export const InvoiceList = ({
  data,
  emptyIcon,
  emptyColor,
  emptyTitle,
  onViewInvoice,
  onDownloadInvoice,
  downloadingKey,
  isLoading
}: {
  data: Invoice[]
  emptyIcon: any
  emptyColor: string
  emptyTitle: string
  onViewInvoice: (invoice: Invoice) => void
  onDownloadInvoice?: (invoice: Invoice, index: number) => void
  downloadingKey: string | null
  isLoading?: boolean
  refetch?: () => void
  isRefetching?: boolean
}) => {
  const router = useRouter()
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.pdfLink + item.date + item.status}
      contentContainerStyle={{ paddingVertical: 12 }}
      renderItem={({ item, index }) => {
        const invoiceKey = `${item.pdfLink}-${item.date}-${index}`
        return (
          <>
            {isLoading ? (
              <ActivityIndicator size="large" />
            ) : (
              <Card style={styles.invoiceCard}>
                <View style={styles.invoiceLeft}>
                  <Image source={IMAGE.pdfIcon} style={styles.pdfIcon} />
                  <View>
                    <Text style={styles.invoiceTitle}>
                      Invoice {index + 1}.pdf
                    </Text>
                    <Text style={styles.invoiceDate}>
                      Due Date: {item.date}
                    </Text>
                    <Text
                      style={[
                        styles.invoiceStatus,
                        { color: item.status === 'paid' ? '#22C55E' : '#F59E0B' },
                      ]}
                    >
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.invoiceActions}>
                  <Pressable onPress={() => onViewInvoice(item)}>
                    <Image source={IMAGE.eye} style={styles.actionIcon} />
                  </Pressable>
                  {onDownloadInvoice && <Pressable onPress={() => onDownloadInvoice?.(item, index)}>
                    {downloadingKey !== invoiceKey ? (
                      <Image
                        source={IMAGE.download}
                        style={styles.actionIcon}
                      />
                    ) : (
                      <View style={[styles.downloadingText, { justifyContent: "center", alignItems: "center" }]}>
                        <ActivityIndicator size="small" />
                      </View>
                    )}
                  </Pressable>}
                </View>
              </Card>
            )}
          </>
        )
      }}
      ListFooterComponent={<HelpSection title='Add Invoice' description='Upload your invoice issued by the CSW team.' icon={IMAGE.add_invoice}
        onPress={() => router.push('/properties/payment-status/add-invoice')} />}
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
  invoiceCard: {
    width: width - 20,
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    marginTop: 12
  },

  invoiceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  pdfIcon: {
    width: 44,
    height: 44,
  },

  invoiceTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  invoiceDate: {
    fontSize: 11,
    color: '#6B7280',
  },

  invoiceStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  invoiceActions: {
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
})