import CustomInput from '@/components/CustomInput'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import FilterModal from '@/components/share/FilterModal'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button from '@/components/ui/button'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native'

interface UploadedFile {
  uri: string
  name: string
  type: string
}

export default function AddInvoice() {
  const { t } = useTranslation()
  const router = useRouter()
  const { width } = useWindowDimensions()

  const [invoiceDate, setInvoiceDate] = useState(new Date())
  const [dueDate, setDueDate] = useState(new Date())
  const [activeDate, setActiveDate] = useState<'invoice' | 'due' | null>(null)

  const [invoiceAmount, setInvoiceAmount] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentDue, setPaymentDue] = useState('')
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isPaymentStatusModalVisible, setIsPaymentStatusModalVisible] = useState(false)

  const formatDate = (date: Date) =>
    date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })

  const pickDocument = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        setUploadedFile({
          uri: asset.uri,
          name: asset.fileName || `file_${Date.now()}`,
          type: asset.mimeType || 'file',
        })
      }
    } catch {
      Alert.alert('Error', 'Failed to pick document')
    }
  }

  const handleSubmit = () => {
    if (!invoiceAmount || !paymentStatus || !paymentDue) {
      Alert.alert('Error', 'Please fill all required fields')
      return
    }

    Alert.alert('Success', 'Invoice added successfully')
    router.back()
  }

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={t('page_title.add_invoice')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />

      <ScrollView
        contentContainerStyle={[styles.container, { paddingHorizontal: width * 0.05 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice Date */}
        <InputCard label="Invoice Date" onPress={() => setActiveDate('invoice')}>
          {formatDate(invoiceDate)}
        </InputCard>

        {/* Due Date */}
        <InputCard label="Due Date" onPress={() => setActiveDate('due')}>
          {formatDate(dueDate)}
        </InputCard>

        <CustomInput
          label="Invoice Amount"
          value={invoiceAmount}
          onChangeText={setInvoiceAmount}
          placeholder="Enter invoice amount"
          keyboardType="numeric"
        />

        {/* Payment Status */}
        <InputCard
          label="Payment Status"
          onPress={() => setIsPaymentStatusModalVisible(true)}
        >
          {paymentStatus || 'Select payment status'}
        </InputCard>

        <FilterModal
          visible={isPaymentStatusModalVisible}
          onClose={() => setIsPaymentStatusModalVisible(false)}
          filterOptions={[
            { label: 'Open', value: 'Open' },
            { label: 'Partially Paid', value: 'Partially Paid' },
            { label: 'Paid', value: 'Paid' },
          ]}
          selectedValue={paymentStatus}
          setSelectedValue={setPaymentStatus}
        />

        <CustomInput
          label="Payment Due"
          value={paymentDue}
          onChangeText={setPaymentDue}
          placeholder="Enter due amount"
          keyboardType="numeric"
        />

        {/* Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Proof of Payment</Text>
          {!uploadedFile ? (
            <Pressable style={styles.uploadBox} onPress={pickDocument}>
              <Text style={styles.uploadText}>Upload Image / PDF</Text>
            </Pressable>
          ) : (
            <View style={styles.fileRow}>
              {uploadedFile.type.includes('image') ? (
                <Image source={{ uri: uploadedFile.uri }} style={styles.thumbnail} />
              ) : (
                <View style={styles.pdfBadge}>
                  <Text style={styles.pdfText}>PDF</Text>
                </View>
                // <ion-icon name="trash-outline"></ion-icon>
              )}
              <Text style={styles.fileName} numberOfLines={1}>
                {uploadedFile.name}
              </Text>
              <Pressable style={{ width: 28, height: 28, justifyContent: "center", alignItems: "center", borderRadius: 50, backgroundColor: "white" }} onPress={() => setUploadedFile(null)}>
                <Ionicons name='trash-outline' size={16} color='#EF4444' />
              </Pressable>
            </View>
          )}
        </View>

        <Button onPress={handleSubmit} style={{ borderRadius: 12 }} title="Add Invoice" />
      </ScrollView>

      {/* iOS-style Date Picker Modal */}
      <Modal transparent visible={!!activeDate} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.dateModal}>
            <DateTimePicker
              value={activeDate === 'invoice' ? invoiceDate : dueDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => {
                if (date) {
                  activeDate === 'invoice'
                    ? setInvoiceDate(date)
                    : setDueDate(date)
                }
              }}
            />
            <Pressable style={styles.doneButton} onPress={() => setActiveDate(null)}>
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaViewWithSpacing>
  )
}

/* ----------------- Small Reusable Card ----------------- */
const InputCard = ({
  label,
  children,
  onPress,
}: {
  label: string
  children: string
  onPress: () => void
}) => (
  <View style={styles.section}>
    <Text style={styles.label}>{label}</Text>
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.cardText}>{children}</Text>
    </Pressable>
  </View>
)

/* ----------------- Styles ----------------- */
const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontFamily: 'Nunito-MediumItalic',
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardText: {
    fontSize: 14,
    color: '#111827',
  },
  uploadBox: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#B08D59',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  uploadText: {
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Nunito-MediumItalic',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(176, 141, 89, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 10,
  },
  thumbnail: {
    width: 42,
    height: 42,
    borderRadius: 8,
  },
  pdfBadge: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito-MediumItalic',
  },
  remove: {
    fontSize: 22,
    color: '#EF4444',
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dateModal: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  doneButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  doneText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '700',
  },
})