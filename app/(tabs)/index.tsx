import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';

import { IMAGE } from '@/assets/images/image.index';
import GradientCard from '@/components/cards/GradientCard';
import PropertyCard from '@/components/cards/PropertyCard';
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing';
import WeatherScreen from '@/components/screens/WeatherScreen';
import HelpSection from '@/components/share/HelpSection';
import SectionHeader from '@/components/share/SectionHeader';
import UserProfileHeader from '@/components/share/UserProfileHeader';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

const PROPERTIES = [
  {
    id: '1',
    name: 'Property 1',
    image:
      'https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg?metadata=true&quality=85',
    location: 'Abu Dhabi, Al Hudayriat Island, Bashayer Villas',
  },
  {
    id: '2',
    name: 'Property 2',
    image:
      'https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg?metadata=true&quality=85',
    location: 'Abu Dhabi, Al Hudayriat Island, Bashayer Villas',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const isTablet = dimensions.width >= 720;
  const numColumns = isTablet ? 2 : 1;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const renderProperty = ({ item }: any) => (
    <View style={styles.propertyWrapper}>
      <PropertyCard
        property={item}
        isTablet={isTablet}
        onViewPress={() => console.log('View Property', item.id)}
      />
    </View>
  );

  return (
    <SafeAreaViewWithSpacing>
      <FlatList
        data={PROPERTIES}
        keyExtractor={(item) => item.id}
        renderItem={renderProperty}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        key={numColumns} // forces re-render when column count changes
        ListHeaderComponent={
          <>
            <UserProfileHeader />
            <WeatherScreen />
            <SectionHeader
              title={t("page_title.my_properties")}
              icon={IMAGE.property_icon}
              action={() => router.push("/(tabs)/Property")}
              actionText={t("action.view_all")}
            />
          </>
        }
        ListFooterComponent={
          <>
            <SectionHeader
              title={t("page_title.latest_insights")}
              icon={IMAGE.insights_icon}
              action={() => router.push("/(tabs)/Insights")}
              actionText={t("action.view_all")}
            />
            <GradientCard
              iconType='green'
              title="Dubai Property Market Shows Strong Q1 Growth"
              subTitle="Latest Insights"
              onPress={() => router.push("/legal-updates/legal-update-detail/1")}
            />
            <HelpSection />
          </>
        }
      />
    </SafeAreaViewWithSpacing>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 12,
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  propertyWrapper: {
    flex: 1,
    margin: 6,
  },
});