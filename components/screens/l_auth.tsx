import KeyboardAvoider from '@/components/safe-area/KeyboardAvoider';
import Loading from '@/components/shimmer/Loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted', formData)
    ToastAndroid.show('Form submitted', ToastAndroid.SHORT)
    setIsLoading(false)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
      </ThemedView>
      <KeyboardAvoider>
        <TextInput
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          style={styles.input} placeholder='Enter your email' />
        <TextInput
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          style={styles.input} placeholder='Enter your password' />
        <Pressable
          style={styles.button}
          onPress={() => handleSubmit()}
          disabled={isLoading}
        >
          {isLoading ? <Loading message='Submitting...' color='#fff' /> : <ThemedText style={{ color: '#fff' }} type="defaultSemiBold">Submit</ThemedText>}
        </Pressable>
      </KeyboardAvoider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    margin: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 4,
    margin: 8,
    alignItems: 'center',
  },
});
