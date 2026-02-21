import { HapticTab } from '@/components/haptic-tab';
import { Building03Icon, Chatting01Icon, Home01Icon, Idea01Icon, UserCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';
const TAB_ICONS = {
  index: {
    focused: <HugeiconsIcon icon={Home01Icon} size={24} color="#fff" />,
    unfocused: <HugeiconsIcon icon={Home01Icon} size={24} color="#666666" />,
  },
  Property: {
    focused: <HugeiconsIcon icon={Building03Icon} size={24} color="#fff" />,
    unfocused: <HugeiconsIcon icon={Building03Icon} size={24} color="#666666" />,
  },
  Insights: {
    focused: <HugeiconsIcon icon={Idea01Icon} size={24} color="#fff" />,
    unfocused: <HugeiconsIcon icon={Idea01Icon} size={24} color="#666666" />,
  },
  Support: {
    focused: <HugeiconsIcon icon={Chatting01Icon} size={24} color="#fff" />,
    unfocused: <HugeiconsIcon icon={Chatting01Icon} size={24} color="#666666" />,
  },
  Profile: {
    focused: <HugeiconsIcon icon={UserCircle02Icon} size={24} color="#fff" />,
    unfocused: <HugeiconsIcon icon={UserCircle02Icon} size={24} color="#666666" />,
  },
} as const;

const renderTabIcon = (route: keyof typeof TAB_ICONS) => ({ focused }: { focused: boolean }) => (
  <View
    style={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? '#D4B785' : 'transparent',
      borderRadius: 50,
      marginTop: focused ? -15 : 5,
      elevation: Platform.OS === 'ios' ? 0 : (focused ? 5 : 0),
    }}
  >
    {focused ? TAB_ICONS[route].focused : TAB_ICONS[route].unfocused}
    {/* <Image
      source={focused ? TAB_ICONS[route].focused : TAB_ICONS[route].unfocused}
      style={{ width: 24, height: 24 }}
      contentFit="contain"
      transition={1000}
      priority="high"
    /> */}
  </View>
);

const renderTabLabel = (label: string) => ({ focused, color }: { focused: boolean; color: string }) => (
  <Text
    style={{
      fontSize: 12,
      fontWeight: focused ? '800' : '600',
      marginBottom: 4,
      color,
    }}
    numberOfLines={1}
  >
    {label}
  </Text>
);

export default function TabLayout() {
  const { t } = useTranslation()
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#D4B785",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: renderTabIcon('index'),
          tabBarLabel: renderTabLabel(t('tabs.home')),
        }}
      />
      <Tabs.Screen
        name="Property"
        options={{
          title: t('tabs.properties'),
          tabBarIcon: renderTabIcon('Property'),
          tabBarLabel: renderTabLabel(t('tabs.properties')),
        }}
      />
      <Tabs.Screen
        name="Insights"
        options={{
          title: t('tabs.insights'),
          tabBarIcon: renderTabIcon('Insights'),
          tabBarLabel: renderTabLabel(t('tabs.insights')),
        }}
      />
      <Tabs.Screen
        name="Support"
        options={{
          title: t('tabs.support'),
          tabBarIcon: renderTabIcon('Support'),
          tabBarLabel: renderTabLabel(t('tabs.support')),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: renderTabIcon('Profile'),
          tabBarLabel: renderTabLabel(t('tabs.profile')),
        }}
      />

    </Tabs>
  );
}