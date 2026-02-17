import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../ui/button';

interface NextButtonProps {
  scrollTo: () => void;
  handleSkip: () => void;
  currentIndex: number;
  slideData: any;
}

export default function NextButton({ scrollTo, handleSkip, currentIndex, slideData }: NextButtonProps) {
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>{t('action.skip')}</Text>
      </TouchableOpacity>
      <Button
        iconPosition='right'
        icon={<MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />}
        style={{ borderRadius: 30, shadowColor: "white" }} onPress={scrollTo} title={t('action.next')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
});