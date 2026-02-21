import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import SafeAreaViewWithSpacing, {
  SafeAreaEdge,
} from '../safe-area/SafeAreaViewWithSpacing'

/* ---------------- Types ---------------- */

interface MessageItemProps {
  _id: number
  message: string
  createdAt: Date
  isMyMessage: boolean
  user: {
    _id: number
    name: string
    avatar: string
  }
}

/* ---------------- Chat Screen ---------------- */

export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const [inputHeight, setInputHeight] = useState(40)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  const listRef = useRef<FlatList>(null)

  const [data, setData] = useState<MessageItemProps[]>([
    {
      _id: 1,
      message: 'Hey! How are you doing?',
      createdAt: new Date(),
      isMyMessage: true,
      user: {
        _id: 1,
        name: 'Me',
        avatar:
          'https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png',
      },
    },
    {
      _id: 2,
      message: "I'm good! What about you?",
      createdAt: new Date(),
      isMyMessage: false,
      user: {
        _id: 2,
        name: 'Support',
        avatar:
          'https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png',
      },
    },
  ])

  /* ---------------- Keyboard Handling ---------------- */

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    )

    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    )

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  /* ---------------- Auto Scroll ---------------- */

  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    })
  }, [data])

  /* ---------------- Send Message ---------------- */

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage: MessageItemProps = {
      _id: Date.now(),
      message,
      createdAt: new Date(),
      isMyMessage: true,
      user: {
        _id: 1,
        name: 'Me',
        avatar:
          'https://png.pngtree.com/png-clipart/20241125/original/pngtree-cartoon-user-avatar-vector-png-image_17295195.png',
      },
    }

    setData((prev) => [...prev, newMessage])
    setMessage('')
    setInputHeight(40)
  }

  /* ---------------- UI ---------------- */

  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.BOTTOM]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        {/* Message List */}
        <View style={styles.listWrapper}>
          <FlatList
            ref={listRef}
            data={[...data].reverse()}
            inverted
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <MessageItem message={item} />}
            contentContainerStyle={styles.list}
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Input */}
        <View
          style={[
            styles.inputWrapper,
            { paddingBottom: keyboardHeight > 0 ? 8 : 0 },
          ]}
        >
          <View style={styles.inputContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message..."
              placeholderTextColor="#9CA3AF"
              multiline
              style={[styles.input, { height: Math.min(120, inputHeight) }]}
              onContentSizeChange={(e) =>
                setInputHeight(e.nativeEvent.contentSize.height + 12)
              }
            />

            <Ionicons
              name="send"
              size={22}
              color={message.trim() ? '#D4B785' : '#9CA3AF'}
              onPress={sendMessage}
              style={styles.sendIcon}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaViewWithSpacing>
  )
}

/* ---------------- Message Bubble ---------------- */

const MessageItem = ({ message }: { message: MessageItemProps }) => {
  const isMine = message.isMyMessage

  const time = message.createdAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <View style={[styles.messageRow, isMine && styles.myRow]}>
      {!isMine && (
        <Image source={{ uri: message.user.avatar }} style={styles.avatar} />
      )}

      <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
        <Text style={[styles.text, isMine && styles.myText]}>
          {message.message}
        </Text>

        <Text style={[styles.time, isMine && styles.myTime]}>{time}</Text>
      </View>
    </View>
  )
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  listWrapper: {
    flex: 1,
  },

  list: {
    padding: 12,
    gap: 12,
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },

  myRow: {
    justifyContent: 'flex-end',
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 20,
  },

  myBubble: {
    backgroundColor: '#D4B785',
    borderBottomRightRadius: 4,
  },

  otherBubble: {
    backgroundColor: '#EFF0F2',
    borderBottomLeftRadius: 4,
  },

  text: {
    fontSize: 15,
    color: '#111',
  },

  myText: {
    color: '#FFF',
  },

  time: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    alignSelf: 'flex-end',
  },

  myTime: {
    color: '#FFFFFFAA',
  },

  inputWrapper: {
    paddingHorizontal: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFF',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },

  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
    paddingVertical: 6,
  },

  sendIcon: {
    borderLeftWidth: 1,
    borderLeftColor: '#fff',
    paddingLeft: 8,
  },
})