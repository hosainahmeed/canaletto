import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { IMAGE } from '@/assets/images/image.index';
import GradientCard from '@/components/cards/GradientCard';
import PropertyCard from '@/components/cards/PropertyCard';
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing';
import WeatherScreen from '@/components/screens/WeatherScreen';
import HelpSection from '@/components/share/HelpSection';
import SectionHeader from '@/components/share/SectionHeader';
import UserProfileHeader from '@/components/share/UserProfileHeader';
import { useRouter } from 'expo-router';

const PROPERTIES = [
  {
    id: '1',
    name: 'Property 1',
    image:
      'https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg?metadata=true&quality=85',
    location: 'Abu Dhabi, Al Hudayriat Island, Bashayer Villas',
  },
];

export default function HomeScreen() {
  const router = useRouter()
  const renderProperty = ({ item }: any) => (
    <PropertyCard
      property={item}
      onViewPress={() => console.log('View Property', item.id)}
    />
  );
  return (
    <SafeAreaViewWithSpacing>
      <FlatList
        data={PROPERTIES}
        keyExtractor={(item) => item.id}
        renderItem={renderProperty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <>
            <UserProfileHeader />
            <WeatherScreen />
            <SectionHeader
              title="MY Properties"
              icon={IMAGE.property_icon}
              action={() => router.push("/(tabs)/Property")}
              actionText="View All"
            />
          </>
        }
        ListFooterComponent={<>
          <SectionHeader
            title="Latest Insights "
            icon={IMAGE.insights_icon}
            action={() => router.push("/(tabs)/Insights")}
            actionText="View All"
          />
          <GradientCard
            iconType='green'
            title="Dubai Property Market Shows Strong Q1 Growth"
            subTitle="Latest Insights"
            onPress={() => router.push("/legal-updates/legal-update-detail/1")}
          />
          <HelpSection />
        </>}
      />
    </SafeAreaViewWithSpacing>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 12,
    paddingVertical: 24,
  },
});
