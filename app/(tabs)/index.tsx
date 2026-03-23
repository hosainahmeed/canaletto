import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo } from "react";
import { RefreshControl, StyleSheet, View, useWindowDimensions } from "react-native";

import { IMAGE } from "@/assets/images/image.index";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import GradientCard from "@/components/cards/GradientCard";
import PropertyCard, { Property } from "@/components/cards/PropertyCard";
import SafeAreaViewWithSpacing from "@/components/safe-area/SafeAreaViewWithSpacing";
import WeatherScreen from "@/components/screens/WeatherScreen";
import HelpSection from "@/components/share/HelpSection";
import SectionHeader from "@/components/share/SectionHeader";
import UserProfileHeader from "@/components/share/UserProfileHeader";

import { useGetMyPropertyQuery } from "../redux/services/propertyApis";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const { data, isLoading } = useGetMyPropertyQuery(undefined);

  const isTablet = width >= 720;
  const numColumns = isTablet ? 2 : 1;

  /* -------- SKELETON DATA -------- */

  const skeletonData = useMemo(() => Array.from({ length: 4 }), []);

  /* -------- NAVIGATION -------- */

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

  /* -------- PROPERTY ITEM -------- */

  const renderProperty = useCallback(
    ({ item }: { item: Property }) => (
      <View style={styles.propertyWrapper}>
        <PropertyCard property={item} isTablet={isTablet} />
      </View>
    ),
    [isTablet, data]
  );

  /* -------- PROPERTY SKELETON -------- */

  const renderPropertySkeleton = () => (
    <View style={styles.propertyWrapper}>
      <View style={styles.propertySkeleton} />
    </View>
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

  /* -------- DATA SOURCE -------- */

  const listData = isLoading ? skeletonData : data?.data ?? [];
  /* -------- RENDER -------- */

  return (
    <SafeAreaViewWithSpacing>
      <FlashList
        data={listData}
        renderItem={isLoading ? renderPropertySkeleton : renderProperty}
        keyExtractor={(item, index) =>
          item?.id ? item.id : index.toString()
        }
        numColumns={numColumns}
        key={numColumns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        refreshControl={
          <RefreshControl refreshing={isLoading} />
        }
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

  propertySkeleton: {
    width: "100%",
    height: 200,
    backgroundColor: "#F0F0F0",
    borderRadius: 16,
  },
});