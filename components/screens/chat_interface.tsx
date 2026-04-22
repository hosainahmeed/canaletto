import { useChatContext } from '@/app/context/ChatContext'
import { useSupportMessageQuery } from '@/app/redux/services/supportMessageRoomApis'
import { useGetMyProfileQuery } from '@/app/redux/services/userApis'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Platform,
  Image as RNImage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import ImagePickerModal from '../share/ImagePickerModal'

interface MessageItemProps {
  id: string,
  ticketId: string,
  senderId: string,
  senderRole: string,
  message: string,
  attachments: string[],
  senderName: string,
  senderProfileImage: string,
  isSeen: boolean,
  seenAt: null | Date,
  createdAt: Date
}


const ME = {
  _id: 1,
  name: 'Me',
  avatar:
    'https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png',
}

const MessageItem = React.memo(({ message }: { message: MessageItemProps }) => {
  const isMine = message?.senderRole?.toUpperCase() === 'CLIENT'
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start()
  }, [])

  const time = message?.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
  const isOptimistic = false

  const statusIcon = () => {
    if (!isMine) return null

    if (message.isSeen) {
      return <Ionicons name="checkmark-done" size={12} color="#FFFFFF" style={styles.statusIcon} />
    }
    return <Ionicons name="checkmark" size={12} color="#FFFFFF88" style={styles.statusIcon} />
  }

  return (
    <Animated.View
      style={[
        styles.messageRow,
        isMine && styles.myRow,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine ? styles.myBubble : styles.otherBubble,
          isOptimistic && styles.optimisticBubble,
        ]}
      >
        {message.attachments && message.attachments.length > 0 && (
          <RNImage
            source={{ uri: message?.attachments[0] }}
            style={[styles.messageImage, isOptimistic && { opacity: 0.7 }]}
            resizeMode="cover"
          />
        )}
        {message.message ? (
          <Text style={[styles.text, isMine && styles.myText]}>{message.message}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <Text style={[styles.time, isMine && styles.myTime]}>{time}</Text>
          {statusIcon()}
        </View>

      </View>
    </Animated.View>
  )
})


// const TypingIndicator = () => {
//   const dot1 = useRef(new Animated.Value(0)).current
//   const dot2 = useRef(new Animated.Value(0)).current
//   const dot3 = useRef(new Animated.Value(0)).current

//   useEffect(() => {
//     const pulse = (dot: Animated.Value, delay: number) =>
//       Animated.loop(
//         Animated.sequence([
//           Animated.delay(delay),
//           Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
//           Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
//           Animated.delay(600),
//         ])
//       )
//     const a1 = pulse(dot1, 0)
//     const a2 = pulse(dot2, 150)
//     const a3 = pulse(dot3, 300)
//     a1.start(); a2.start(); a3.start()
//     return () => { a1.stop(); a2.stop(); a3.stop() }
//   }, [])

//   const dotStyle = (anim: Animated.Value) => [styles.dot, { transform: [{ translateY: anim }] }]

//   return (
//     <View style={styles.messageRow}>
//       <View style={[styles.bubble, styles.otherBubble, styles.typingBubble]}>
//         <Animated.View style={dotStyle(dot1)} />
//         <Animated.View style={dotStyle(dot2)} />
//         <Animated.View style={dotStyle(dot3)} />
//       </View>
//     </View>
//   )
// }

export default function ChatInterface() {
  const { id } = useLocalSearchParams()
  const { data: chatDataFromApi, isLoading, refetch } = useSupportMessageQuery(id as string, { skip: !id })
  const { data: profileData } = useGetMyProfileQuery(undefined)
  const [message, setMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(40)
  const { sendMessage, onNewMessage, onTicketUpdated } = useChatContext()
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [imageUri, setImageUri] = useState<string | null>(null)

  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true })
  }, [chatDataFromApi])

  useEffect(() => {
    // Listen for new messages
    const handleNewMessage = (newMessage: any) => {
      console.log('New message received:', newMessage)
      // Refetch the messages to get the latest data
      refetch()
    }

    const handleTicketUpdated = (updatedTicket: any) => {
      console.log('Ticket updated:', updatedTicket)
      // Refetch the messages to get the latest data
      refetch()
    }

    // Set up event listeners
    onNewMessage(handleNewMessage)
    onTicketUpdated(handleTicketUpdated)

    // Cleanup listeners when component unmounts
    return () => {
      // Note: Socket cleanup is handled in ChatContext
    }
  }, [onNewMessage, onTicketUpdated, refetch])



  const sendMessageHandler = useCallback(async () => {
    if (!message.trim() && !imageUri) return

    const tempId = `temp_${Date.now()}`
    const optimisticMsg: MessageItemProps = {
      id: tempId,
      ticketId: id as string,
      senderId: profileData?.data?.id || 'current-user-id',
      senderRole: 'client',
      message: message.trim(),
      attachments: imageUri ? [imageUri] : [],
      senderName: 'Me',
      senderProfileImage: ME.avatar,
      isSeen: false,
      seenAt: null,
      createdAt: new Date()
    }
    if (!id) {
      console.log('No ticket ID available, cannot send message');
      return;
    }
    const messagePayloadData = {
      ticketId: id,
      message: message.trim(),
      attachments: imageUri ? [imageUri] : []
    }


    await sendMessage(messagePayloadData?.ticketId as string, messagePayloadData?.message as string, messagePayloadData?.attachments as string[])
    setMessage('')
    setInputHeight(40)
    setImageUri(null)
  }, [message, imageUri])

  const handleImageSelected = (uri: string) => {
    setImageUri(uri)
    setImageModalVisible(false)
  }



  const renderItem = useCallback(
    ({ item }: { item: MessageItemProps }) => (
      <MessageItem message={item} />
    ),
    []
  )

  const canSend = message.trim().length > 0 || !!imageUri
  if (isLoading) {
    return <ActivityIndicator />
  }
  return (
    <View style={styles.container}>
      {/* Message List */}
      <View style={styles.listWrapper}>
        <FlatList
          ref={listRef}
          data={chatDataFromApi?.data}
          inverted
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}

          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={10}
          windowSize={15}
        />
      </View>

      <View style={styles.inputWrapper}>
        {imageUri && (
          <View style={styles.imagePreviewContainer}>
            <RNImage source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImageUri(null)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={22} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setImageModalVisible(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="add-circle-outline" size={24} color="#9CA3AF" />
          </TouchableOpacity>

          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message..."
            placeholderTextColor="#9CA3AF"
            multiline
            style={[styles.input, { height: Math.min(120, Math.max(40, inputHeight)) }]}
            onContentSizeChange={(e) =>
              setInputHeight(e.nativeEvent.contentSize.height + 12)
            }
            returnKeyType="default"
          />

          <TouchableOpacity
            onPress={sendMessageHandler}
            disabled={!canSend}
            style={[styles.sendButton, canSend && styles.sendButtonActive]}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons name="send" size={16} color={canSend ? '#FFF' : '#9CA3AF'} />
          </TouchableOpacity>
        </View>
      </View>

      <ImagePickerModal
        visible={imageModalVisible}
        onClose={() => setImageModalVisible(false)}
        onImageSelected={handleImageSelected}
      />
    </View>
  )
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  listWrapper: { flex: 1 },
  list: { padding: 12, gap: 8 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  myRow: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '78%', padding: 10, borderRadius: 18 },
  myBubble: { backgroundColor: '#D4B785', borderBottomRightRadius: 4 },
  otherBubble: { backgroundColor: '#EFF0F2', borderBottomLeftRadius: 4 },
  optimisticBubble: { opacity: 0.75 },
  failedBubble: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5' },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  text: { fontSize: 15, color: '#111', lineHeight: 21 },
  myText: { color: '#FFF' },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 3 },
  time: { fontSize: 11, color: '#9CA3AF' },
  myTime: { color: '#FFFFFFAA' },
  statusIcon: { marginLeft: 1 },
  failedLabel: { fontSize: 11, color: '#EF4444', marginTop: 4 },

  inputWrapper: {
    paddingHorizontal: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingVertical: 6,
    color: '#111',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendButtonActive: {
    backgroundColor: '#D4B785',
  },

  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  imagePreview: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    left: 48,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  messageImage: {
    width: 210,
    height: 210,
    borderRadius: 12,
    marginBottom: 6,
  },
})