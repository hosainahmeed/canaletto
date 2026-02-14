import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing';
import Button, { ButtonType } from '@/components/ui/button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaViewWithSpacing>
      {/* Background Decoration */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="home-outline" size={80} color="#D4A574" />
          <View style={styles.questionMarkContainer}>
            <Text style={styles.questionMark}>?</Text>
          </View>
        </View>

        {/* 404 Text */}
        <Text style={styles.errorCode}>404</Text>

        {/* Title */}
        <Text style={styles.title}>Page Not Found</Text>

        {/* Description */}
        <Text style={styles.description}>
          Oops! The property you're looking for doesn't exist or has been moved.
        </Text>

        {/* Buttons */}

        <View style={styles.buttonContainer}>
          <Button
            style={{ width: "100%", borderRadius: 12 }}
            icon={<Ionicons name="home" size={20} color="#FFFFFF" />}
            title="Go to Home"
            onPress={handleGoHome}
            type={ButtonType.PRIMARY}
          />
          <Button
            style={{ width: "100%", borderRadius: 12 }}
            icon={<Ionicons name="arrow-back" size={20} color="#D4A574" />}
            title="Go Back"
            onPress={handleGoBack}
            type={ButtonType.OUTLINE}
          />
        </View>
      </View>
    </SafeAreaViewWithSpacing>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  backgroundDecoration: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: '#D4A574',
  },
  circle1: {
    width: 300,
    height: 300,
    top: -150,
    right: -100,
    opacity: 0.05,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -80,
    left: -60,
    opacity: 0.08,
  },
  circle3: {
    width: 150,
    height: 150,
    top: '50%',
    left: -75,
    opacity: 0.06,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  questionMarkContainer: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#D4A574',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F9FAFB',
  },
  questionMark: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  errorCode: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#D4A574',
    marginBottom: 16,
    letterSpacing: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#D4A574',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#D4A574',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#D4A574',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D4A574',
    letterSpacing: 0.5,
  },
});