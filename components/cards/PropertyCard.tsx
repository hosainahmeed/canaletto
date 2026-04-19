import { IMAGE } from '@/assets/images/image.index';
import FallbackImage from '@/utils/FallbackImage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Button, { ButtonSize } from '../ui/button';

export interface Property {
  id: string;
  managerId: string;
  name: string;
  images: string[];
  type: string;
  size: string;
  totalRooms: number;
  status: string;
  paymentPlan: string;
  units: number;
  constructionProgressPercentage: number;
  address: string;
  createdAt: string;
  updatedAt: string;
  manager: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PropertyCardProps {
  property: Property;
  onViewPress?: () => void;
  isTablet?: boolean;
}

const { width } = Dimensions.get('window');

export default React.memo(function PropertyCard({ property, isTablet }: PropertyCardProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const cardWidth = isTablet ? width / 2 - 20 : width - 20;
  const imageHeight = isTablet ? 220 : 180;
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <FallbackImage url={property?.images[0]} style={styles.image} resizeMode="cover" />
        {/* <Image source={{ uri: property?.images[0] }} style={styles.image} resizeMode="cover" /> */}
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.propertyName, { fontSize: isTablet ? 18 : 16 }]}>{property?.name}</Text>
        <Image style={styles.bursar} source={IMAGE.bursar} />
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#9CA3AF" />
          <Text style={styles.locationText}>{property?.address}</Text>
        </View>

        <Button
          size={ButtonSize.MEDIUM}
          style={{ alignSelf: 'flex-start', borderRadius: 8, minWidth: "100%" }}
          onPress={() => router.push(`/properties/${property?.id}`)}
          title={t('action.view_property')}
          iconPosition='right'
          icon={<Image style={{ width: 20, height: 20 }} source={IMAGE.forward_icon} />}
        />
      </View>
    </View>
  );
})

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginHorizontal: "auto",
  },
  imageContainer: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  contentContainer: {
    padding: 12,
    paddingTop: 16,
    position: "relative",
  },
  propertyName: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  bursar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 80,
    height: 120,
    zIndex: 999,
    pointerEvents: "none",
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    flex: 1,
  },
});