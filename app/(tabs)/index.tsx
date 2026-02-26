import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";

import { IMAGE } from "@/assets/images/image.index";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import GradientCard from "@/components/cards/GradientCard";
import PropertyCard from "@/components/cards/PropertyCard";
import SafeAreaViewWithSpacing from "@/components/safe-area/SafeAreaViewWithSpacing";
import WeatherScreen from "@/components/screens/WeatherScreen";
import HelpSection from "@/components/share/HelpSection";
import SectionHeader from "@/components/share/SectionHeader";
import UserProfileHeader from "@/components/share/UserProfileHeader";

const PROPERTIES = [
  {
    id: "1",
    name: "Property 1",
    image:
      "https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg",
    location: "Abu Dhabi, Al Hudayriat Island, Bashayer Villas",
  },
  {
    id: "2",
    name: "Property 2",
    image:
      "https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg",
    location: "Abu Dhabi, Al Hudayriat Island, Bashayer Villas",
  },
];


export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isTablet = width >= 720;
  const numColumns = isTablet ? 2 : 1;

  const goProperty = useCallback(
    () => router.push("/(tabs)/Property"),
    [router]
  );

  const goInsights = useCallback(
    () => router.push("/(tabs)/Insights"),
    [router]
  );

  const goLegalUpdate = useCallback(
    () => router.push("/legal-updates/legal-update-detail/1"),
    [router]
  );

  const renderProperty = useCallback(
    ({ item }: any) => (
      <View style={styles.propertyWrapper}>
        <PropertyCard
          property={item}
          isTablet={isTablet}
          onViewPress={() =>
            console.log("View Property", item.id)
          }
        />
      </View>
    ),
    [isTablet]
  );

  /* -------- HEADER -------- */

  const ListHeader = useMemo(
    () => (
      <>
        <UserProfileHeader />
        <WeatherScreen />
        <SectionHeader
          title={t("page_title.my_properties")}
          icon={IMAGE.property_icon}
          action={goProperty}
          actionText={t("action.view_all")}
          style={{ marginBottom: -20 }}
        />
      </>
    ),
    [t, goProperty]
  );

  /* -------- FOOTER -------- */

  const ListFooter = useMemo(
    () => (
      <>
        <View>
          <SectionHeader
            title="Legal Updates"
            icon={IMAGE.legal}
            action={() => router.push("/legal-updates")}
            actionText={t("action.view_all")}
          />

          <GradientCard
            iconType="green"
            title="Dubai Property Market Shows Strong Q1 Growth"
            subTitle="Legal Updates"
            onPress={goLegalUpdate}
          />
        </View>
        <View>
          <SectionHeader
            title="New Projects"
            icon={IMAGE.newProjectIcon}
            action={() => router.push("/new-projects")}
            actionText={t("action.view_all")}
          />

          <GradientCard
            iconType="pink"
            color={['#A855F780', '#FAFAFA', '#FAFAFA']}
            title="Dubai Property Market Shows Strong Q1 Growth"
            subTitle="New Projects"
            onPress={goLegalUpdate}
          />
        </View>
        <View>
          <SectionHeader
            title="Latest Insights"
            icon={IMAGE.insights_icon}
            action={goInsights}
            actionText={t("action.view_all")}
          />

          <GradientCard
            iconType="blue"
            color={['#3B82F680', '#FAFAFA', '#FAFAFA']}
            title="Dubai Property Market Shows Strong Q1 Growth"
            subTitle="Market Updates"
            onPress={goLegalUpdate}
          />
        </View>

        <HelpSection />
      </>
    ),
    [t, goInsights, goLegalUpdate]
  );

  return (
    <SafeAreaViewWithSpacing>
      <FlashList
        data={PROPERTIES}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
      />
    </SafeAreaViewWithSpacing>
  );
}


const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    gap: 12,
  },
  propertyWrapper: {
    flex: 1,
  },
});