import { useGetInvoiceByPropertyIdQuery, useGetPaymentPlansByPropertyIdQuery } from '@/app/redux/services/paymentInvoicePlanApis'
import { IMAGE } from '@/assets/images/image.index'
import { InvoiceList } from '@/components/payment-status/InvoiceList'
import { PaymentPlanList } from '@/components/payment-status/PaymentPlanList'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useFileDownload } from '@/hooks/useFileDownload'
import { Invoice, PaymentPlan } from '@/types'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { t } from 'i18next'
import React from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'



const pendingInvoices: Invoice[] = [
  {
    id: "1",
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '2025-10-15',
    status: 'pending',
  },
  {
    id: "13",
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '2025-10-16',
    status: 'pending',
  },
  {
    id: "123",
    pdfLink: 'https://morth.nic.in/sites/default/files/dd12-13_0.pdf',
    date: '2025-10-17',
    status: 'pending',
  },
]

const { width } = Dimensions.get('window')
const TAB_WRAPPER_WIDTH = width - 20
const TAB_GAP = 10
const TAB_BUTTON_WIDTH = (TAB_WRAPPER_WIDTH - TAB_GAP) / 2
export default function PaymentStaus() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const [activeButton, setActiveButton] = React.useState<'Payment Invoices' | 'Payment Plan'>('Payment Invoices')

  const { data: invoices, isLoading: isLoadingInvoices } = useGetInvoiceByPropertyIdQuery(id as string, { skip: !id || activeButton !== 'Payment Invoices' })
  console.log('invoices', invoices)
  const { data: paymentPlans, isLoading: isLoadingPaymentPlans } = useGetPaymentPlansByPropertyIdQuery(id as string, { skip: !id || activeButton !== 'Payment Plan' })

  // console.log('invoices', invoices)

  const { downloadingKey, downloadFile } = useFileDownload()
  const TABS = ['Payment Invoices', 'Payment Plan'] as const

  const indicatorX = useSharedValue(0)

  const handleTabChange = (tab: 'Payment Invoices' | 'Payment Plan', index: number) => {
    setActiveButton(tab)
    indicatorX.value = withTiming(index * (TAB_BUTTON_WIDTH + TAB_GAP), { duration: 250 })
  }

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }))

  const handleViewInvoice = React.useCallback((invoice: Invoice) => {
    router.push(`/properties/payment-status/invoice-details/${invoice.id}`)
  }, [router])

  const handleViewPaymentPlan = React.useCallback((paymentPlan: PaymentPlan) => {
    router.push({
      pathname: '/properties/files/PdfViewer',
      params: { pdfLink: paymentPlan?.file_url, title: paymentPlan.name },
    });
  }, [router])

  const handleDownloadInvoice = React.useCallback(async (invoice: Invoice, index: number) => {
    const invoiceKey = `${invoice.pdfLink}-${invoice.date}-${index}`
    const fileName = `invoice-${index + 1}.pdf`
    const fileItem = {
      id: invoice.id,
      name: fileName,
      file_url: invoice.pdfLink,
      createdAt: invoice.date,
      updatedAt: invoice.date
    }
    await downloadFile(fileItem, fileName, invoiceKey)
  }, [downloadFile])

  const handleDownloadPaymentPlan = React.useCallback(async (paymentPlan: PaymentPlan, index: number) => {
    const paymentPlanKey = `${paymentPlan.file_url}-${paymentPlan.createdAt}-${index}`
    const fileName = `${paymentPlan.name}.pdf`
    const fileItem = {
      id: paymentPlan.id,
      name: paymentPlan.name,
      file_url: paymentPlan.file_url,
      createdAt: paymentPlan.createdAt,
      updatedAt: paymentPlan.updatedAt
    }
    await downloadFile(fileItem, fileName, paymentPlanKey)
  }, [downloadFile])

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={t('property_details.payment_status')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />

      <View style={styles.tabWrapper}>
        <Animated.View style={[styles.tabIndicator, indicatorStyle]} />

        {TABS.map((tab, index) => {
          const isActive = activeButton === tab
          return (
            <Pressable
              key={tab}
              style={[
                styles.tabButton,
                activeButton !== tab && styles.deActiveTabButton,
              ]}
              onPress={() => handleTabChange(tab, index)}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          )
        })}
      </View>

      {activeButton === 'Payment Invoices' ? (
        <InvoiceList
          data={invoices?.data || []}
          emptyIcon={IMAGE.emptyGreen}
          isLoading={isLoadingInvoices}
          emptyColor="#22C55E"
          emptyTitle={t('message.no_pending_payment_invoice_available')}
          onViewInvoice={handleViewInvoice}
          downloadingKey={downloadingKey}
        />
      ) : (
        <PaymentPlanList
          data={paymentPlans?.data?.data || []}
          emptyIcon={IMAGE.emptyGreen}
          emptyColor="#22C55E"
          emptyTitle={t('message.no_paid_payment_plan_available')}
          onViewInvoice={handleViewPaymentPlan}
          onDownloadInvoice={handleDownloadPaymentPlan}
          downloadingKey={downloadingKey}
        />
      )}

    </SafeAreaViewWithSpacing>
  )
}



const styles = StyleSheet.create({
  tabWrapper: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: "auto",
    width: TAB_WRAPPER_WIDTH,
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },

  tabButton: {
    width: TAB_BUTTON_WIDTH,
    paddingVertical: 14,
    alignItems: 'center',
    zIndex: 2,
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B08D59',
  },

  activeTabText: {
    color: '#FFFFFF',
  },
  deActiveTabButton: {
    borderWidth: 1,
    borderColor: '#D4B785',
    borderRadius: 12,
    backgroundColor: 'rgba(212, 183, 133, 0.3)',
  },
  tabIndicator: {
    position: 'absolute',
    width: TAB_BUTTON_WIDTH,
    height: '100%',
    backgroundColor: '#D4B785',
    borderRadius: 12,
  },

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
