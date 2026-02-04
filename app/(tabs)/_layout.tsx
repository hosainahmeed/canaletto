import { IMAGE } from '@/assets/images/image.index';
import { HapticTab } from '@/components/haptic-tab';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

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
      elevation: focused ? 3 : 0,
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
  >
    {label}
  </Text>
);

export default function TabLayout() {
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
          title: 'Home',
          tabBarIcon: renderTabIcon('index'),
          tabBarLabel: renderTabLabel('Home'),
        }}
      />
      <Tabs.Screen
        name="Property"
        options={{
          title: 'Property',
          tabBarIcon: renderTabIcon('Property'),
          tabBarLabel: renderTabLabel('Property'),
        }}
      />
      <Tabs.Screen
        name="Insights"
        options={{
          title: 'Insights',
          tabBarIcon: renderTabIcon('Insights'),
          tabBarLabel: renderTabLabel('Insights'),
        }}
      />
      <Tabs.Screen
        name="Support"
        options={{
          title: 'Support',
          tabBarIcon: renderTabIcon('Support'),
          tabBarLabel: renderTabLabel('Support'),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: renderTabIcon('Profile'),
          tabBarLabel: renderTabLabel('Profile'),
        }}
      />

    </Tabs>
  );
}