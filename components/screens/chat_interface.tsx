import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
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
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import ImagePickerModal from '../share/ImagePickerModal'

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageStatus = 'sending' | 'sent' | 'delivered' | 'failed'

interface MessageItemProps {
  _id: number | string
  message: string
  createdAt: Date
  isMyMessage: boolean
  user: {
    _id: number
    name: string
    avatar: string
  }
  image?: string
  status?: MessageStatus   // only for my messages
  isOptimistic?: boolean   // true while awaiting server confirmation
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ME = {
  _id: 1,
  name: 'Me',
  avatar:
    'https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png',
}

const SUPPORT = {
  _id: 2,
  name: 'Support',
  avatar:
    'https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png',
}

/** Simulate sending to a server – replace with your real API call. */
async function sendMessageToServer(msg: MessageItemProps): Promise<MessageItemProps> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate 5 % failure rate so you can test error handling
      if (Math.random() < 0.05) reject(new Error('Network error'))
      else resolve({ ...msg, status: 'delivered', isOptimistic: false })
    }, 800)
  })
}

// ─── MessageItem ──────────────────────────────────────────────────────────────

const MessageItem = React.memo(({ message }: { message: MessageItemProps }) => {
  const isMine = message.isMyMessage
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start()
  }, [])

  const time = message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const isOptimistic = message.isOptimistic

  const statusIcon = () => {
    if (!isMine) return null
    switch (message.status) {
      case 'sending': return <ActivityIndicator size={10} color="#FFFFFF88" style={styles.statusIcon} />
      case 'sent': return <Ionicons name="checkmark" size={12} color="#FFFFFF88" style={styles.statusIcon} />
      case 'delivered': return <Ionicons name="checkmark-done" size={12} color="#FFFFFF" style={styles.statusIcon} />
      case 'failed': return <Ionicons name="alert-circle" size={13} color="#FF6B6B" style={styles.statusIcon} />
      default: return null
    }
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
          message.status === 'failed' && styles.failedBubble,
        ]}
      >
        {message.image && (
          <RNImage
            source={{ uri: message.image }}
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

        {message.status === 'failed' && isMine && (
          <Text style={styles.failedLabel}>Failed to send · Tap to retry</Text>
        )}
      </View>
    </Animated.View>
  )
})

// ─── TypingIndicator ──────────────────────────────────────────────────────────

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const pulse = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      )
    const a1 = pulse(dot1, 0)
    const a2 = pulse(dot2, 150)
    const a3 = pulse(dot3, 300)
    a1.start(); a2.start(); a3.start()
    return () => { a1.stop(); a2.stop(); a3.stop() }
  }, [])

  const dotStyle = (anim: Animated.Value) => [styles.dot, { transform: [{ translateY: anim }] }]

  return (
    <View style={styles.messageRow}>
      <View style={[styles.bubble, styles.otherBubble, styles.typingBubble]}>
        <Animated.View style={dotStyle(dot1)} />
        <Animated.View style={dotStyle(dot2)} />
        <Animated.View style={dotStyle(dot3)} />
      </View>
    </View>
  )
}

// ─── ChatInterface ────────────────────────────────────────────────────────────

export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(40)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)   // remote typing indicator

  const listRef = useRef<FlatList>(null)

  const [data, setData] = useState<MessageItemProps[]>([
    {
      _id: 1,
      message: 'Hey! How are you doing?',
      createdAt: new Date(),
      isMyMessage: true,
      user: ME,
      status: 'delivered',
    },
    {
      _id: 2,
      message: "I'm good! What about you?",
      createdAt: new Date(),
      isMyMessage: false,
      user: SUPPORT,
    },
  ])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true })
  }, [data])

  // ── Optimistic send ──────────────────────────────────────────────────────

  const sendMessage = useCallback(async () => {
    if (!message.trim() && !imageUri) return

    const tempId = `temp_${Date.now()}`
    const optimisticMsg: MessageItemProps = {
      _id: tempId,
      message: message.trim(),
      createdAt: new Date(),
      isMyMessage: true,
      user: ME,
      image: imageUri ?? undefined,
      status: 'sending',
      isOptimistic: true,
    }

    // 1. Immediately add to UI
    setData((prev) => [...prev, optimisticMsg])
    setMessage('')
    setInputHeight(40)
    setImageUri(null)

    // 2. Send to server
    try {
      const confirmed = await sendMessageToServer(optimisticMsg)
      setData((prev) =>
        prev.map((m) => (m._id === tempId ? { ...confirmed, _id: tempId } : m))
      )

      // Simulate remote typing + reply (demo only – remove in production)
      simulateBotReply()
    } catch {
      // 3. On failure, mark message as failed
      setData((prev) =>
        prev.map((m) =>
          m._id === tempId ? { ...m, status: 'failed', isOptimistic: false } : m
        )
      )
    }
  }, [message, imageUri])

  /** Demo: shows typing indicator then sends a bot reply */
  const simulateBotReply = () => {
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const reply: MessageItemProps = {
          _id: Date.now(),
          message: 'Got it! Let me look into that for you 👀',
          createdAt: new Date(),
          isMyMessage: false,
          user: SUPPORT,
        }
        setData((prev) => [...prev, reply])
      }, 2000)
    }, 600)
  }

  // ── Retry failed message ─────────────────────────────────────────────────

  const retryMessage = useCallback(async (msg: MessageItemProps) => {
    setData((prev) =>
      prev.map((m) => (m._id === msg._id ? { ...m, status: 'sending', isOptimistic: true } : m))
    )
    try {
      const confirmed = await sendMessageToServer(msg)
      setData((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...confirmed, _id: msg._id } : m))
      )
    } catch {
      setData((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, status: 'failed', isOptimistic: false } : m))
      )
    }
  }, [])

  // ── Image picking ────────────────────────────────────────────────────────

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') return
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    })
    if (!result.canceled) setImageUri(result.assets[0].uri)
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') return
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 })
    if (!result.canceled) setImageUri(result.assets[0].uri)
  }

  // ── Render ───────────────────────────────────────────────────────────────

  const renderItem = useCallback(
    ({ item }: { item: MessageItemProps }) => (
      <TouchableOpacity
        activeOpacity={item.status === 'failed' ? 0.6 : 1}
        onPress={() => item.status === 'failed' && retryMessage(item)}
      >
        <MessageItem message={item} />
      </TouchableOpacity>
    ),
    [retryMessage]
  )

  const canSend = message.trim().length > 0 || !!imageUri

  return (
    <KeyboardAwareScrollView bottomOffset={62} contentContainerStyle={styles.container}>
      {/* Message List */}
      <View style={styles.listWrapper}>
        <FlatList
          ref={listRef}
          data={[...data].reverse()}
          inverted
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={isTyping ? <TypingIndicator /> : null}
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
            onPress={sendMessage}
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
        onCamera={takePhoto}
        onGallery={pickFromGallery}
      />
    </KeyboardAwareScrollView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  // ── Input ──
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
  // ── Image preview ──
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