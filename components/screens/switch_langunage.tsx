import Button, { ButtonType } from '@/components/ui/button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, View } from 'react-native';

export default function SwitchLanguage() {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = React.useState(false);
  const toggleLanguage = (lang: string) => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lang);
    } else {
      console.error('i18n.changeLanguage is not available');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>{t('welcome')}</Text>
      <Button title={t('change_language')} onPress={() => setModalVisible(true)} />
      <Modal visible={modalVisible}>
        <View>
          <Text style={{ fontSize: 24 }}>{t('select_language')}</Text>
          <Button type={ButtonType.GHOST} title="English" onPress={() => toggleLanguage('en')} />
          <Button type={ButtonType.GHOST} title="German" onPress={() => toggleLanguage('de')} />
          <Button type={ButtonType.OUTLINE} title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({})