import { IMAGE } from '@/assets/images/image.index';
import { HapticTab } from '@/components/haptic-tab';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Text, View } from 'react-native';

const TAB_ICONS = {
  index: {
    focused: IMAGE.home_icon_fill,
    unfocused: IMAGE.home_icon,
  },
  Property: {
    focused: IMAGE.property_icon_fill,
    unfocused: IMAGE.property_icon,
  },
  Insights: {
    focused: IMAGE.insights_icon_fill,
    unfocused: IMAGE.insights_icon,
  },
  Support: {
    focused: IMAGE.support_icon_fill,
    unfocused: IMAGE.support_icon,
  },
  Profile: {
    focused: IMAGE.profile_icon_fill,
    unfocused: IMAGE.profile_icon,
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
    <Image
      source={focused ? TAB_ICONS[route].focused : TAB_ICONS[route].unfocused}
      style={{ width: 24, height: 24 }}
      contentFit="contain"
      transition={1000}
      priority="high"
    />
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