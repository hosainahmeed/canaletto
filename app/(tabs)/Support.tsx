import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import SectionHeader from '@/components/share/SectionHeader'
import { useToast } from '@/components/toast/useToast'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button, { ButtonType } from '@/components/ui/button'
import { MyTicket } from '@/types/myTicketType'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Modal, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { useChatContext } from '../context/ChatContext'
import { useMyTicketsQuery, useTicketCreateMutation } from '../redux/services/supportTicketApis'

export default function Support() {
  const router = useRouter()
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const { width: screenWidth } = useWindowDimensions()
  const [createTicket, { isLoading }] = useTicketCreateMutation()
  const [issue, setIssue] = useState<string>("")
  const [isCreatingRoom, setIsCreatingRoom] = useState<boolean>(false)
  const toast = useToast()
  const { isConnected, joinTicketRoom } = useChatContext()
  const { data: myTickets, isLoading: isMyTicketsLoading, refetch } = useMyTicketsQuery(undefined)

  const handlerCreateTicketForSupport = async () => {
    if (!issue.trim()) {
      toast.error(t("support.modal.error.empty") || "Please describe your issue before submitting.");
      return;
    }

    try {
      setIsCreatingRoom(true);
      const res = await createTicket({ issue: issue.trim() }).unwrap()
      if (!res?.success) {
        throw new Error(res?.message)
      }


      if (res?.data?.id && isConnected) {
        joinTicketRoom(res.data.id);
      }

      toast.success(t("support.modal.room_created") || "Support room created successfully! You can now chat with our support team.")
      setIssue("");
      setModalVisible(false);

      setTimeout(() => {
        // router.push(`/chat/${res?.data?.id}`);
        router.push({
          pathname: '/chat/[id]',
          params: { id: res?.data?.id }
        })
      }, 1000);

    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Something went wrong while creating support ticket";
      toast.error(errorMessage)
    } finally {
      setIsCreatingRoom(false);
    }
  }
  return (
    <SafeAreaViewWithSpacing>
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
        titleStyle={styles.headerTitle}
        title="Support"
      />

      <FlatList
        ListHeaderComponent={() => (
          <>
            <TouchableOpacity activeOpacity={0.9} onPress={() => setModalVisible(!modalVisible)}>
              <Card style={[styles.card, { width: screenWidth - 12 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: "space-between" }}>
                  <Image source={IMAGE.moon} style={styles.icon} />
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>• {t("support.status")}</Text>
                  </View>
                </View>
                <View style={styles.contentWrapper}>
                  <View>
                    <Text style={styles.title}>{t("support.title")}</Text>
                    <Text style={styles.subtitle}>{t("support.description")}</Text>
                  </View>
                  <LinearGradient style={styles.iconWrapper} colors={["#D4B785", "#B08D59"]}>
                    <Image style={styles.chatIcon} source={IMAGE.support_icon_fill} />
                  </LinearGradient>
                </View>
              </Card>
            </TouchableOpacity>

            <View style={{ height: 12 }} />
            <View>
              <SectionHeader title="My Support Tickets" />
            </View>
          </>
        )}
        data={myTickets?.data?.data as MyTicket[]}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              router.push({
                pathname: '/chat/[id]',
                params: { id: item.id }
              })
            }}
          >
            <Card style={[styles.card, { width: screenWidth - 12, marginBottom: 8 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: "space-between", gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                  <Image source={{ uri: item?.supportMember?.profile_image ?? "https://krita-artists.org/uploads/default/original/3X/6/e/6eba1089278dd4cfa35eb34bfffaad96ee331da4.jpeg" }} style={styles.icon} />
                  <View>
                    <Text style={[styles.supportName, { color: '#1A1A1A' }]} numberOfLines={1}>{item?.supportMember?.name || "Support"}</Text>
                    <Text style={[styles.subtitle, { fontSize: 10, color: '#999' }]} numberOfLines={1}>
                      {new Date(item?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={[styles.statusBadge, { backgroundColor: item.status === 'open' ? '#22c55e' : item.status === 'closed' ? '#ef4444' : '#f59e0b' }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                  {item.unseenCount > 0 && (
                    <View style={styles.unseenBadge}>
                      <Text style={styles.unseenBadgeText}>{item.unseenCount}</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={[styles.subtitle, { marginTop: 4 }]} numberOfLines={2}>{item?.issue ?? "You can now start a conversation with our support team"}</Text>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <Text style={styles.subtitle}>No support tickets found</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?.id || ''}
        refreshControl={<RefreshControl refreshing={isMyTicketsLoading} onRefresh={() => refetch()} />}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("support.modal.title") || "Contact Support"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* <Text style={styles.modalDescription}>
              {t("support.modal.description") || "Describe your issue and we'll create a support room for you to chat with our team."}
            </Text> */}

            <TextInput
              style={styles.textInput}
              placeholder={t("support.modal.placeholder") || "Please describe your issue in detail..."}
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={4}
              value={issue}
              onChangeText={setIssue}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <Button
                onPress={() => setModalVisible(!modalVisible)}
                title={t("support.modal.cancel") || "Cancel"}
                type={ButtonType.OUTLINE}
                style={styles.cancelButton}
              />
              <Button
                onPress={handlerCreateTicketForSupport}
                title={isCreatingRoom ? (t("support.modal.creating_room") || "Creating Room...") : (t("support.modal.submit") || "Create Room")}
                loading={isLoading || isCreatingRoom}
                disabled={!issue.trim() || isLoading || isCreatingRoom}
                style={styles.submitButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontStyle: 'italic',
    fontFamily: 'Montserrat-Italic',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
    marginHorizontal: 'auto',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 12,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6cda4a3",
  },
  badgeContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 1)',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    color: 'rgba(34, 197, 94, 1)',
  },
  contentWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    wordWrap: 'wrap',
    width: '90%',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    wordWrap: 'wrap',
    width: '90%',
    color: '#B0B0B0',
  },
  supportName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    color: '#1A1A1A',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    padding: 12,
  },
  chatIcon: {
    width: 24,
    height: 24,
  },
  modalView: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'stretch',

    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },

    // Android elevation
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    color: '#1A1A1A',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  unseenBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginTop: 4,
  },
  unseenBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
  },
  statusContainer: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  statusText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
})