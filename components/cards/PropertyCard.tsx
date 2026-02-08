import { IMAGE } from '@/assets/images/image.index';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Button, { ButtonSize } from '../ui/button';

export interface Property {
  id: string;
  name: string;
  image: string;
  location: string;
}

export interface PropertyCardProps {
  property: Property;
  onViewPress?: () => void;
}
const { width } = Dimensions.get('window')

export default function PropertyCard({ property, onViewPress }: PropertyCardProps) {
  const router = useRouter()
  const { t } = useTranslation()
  return (
    <View style={styles.card}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.image }} style={styles.image} resizeMode="cover" />
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Property Name */}
        <Text style={styles.propertyName}>{property.name}</Text>
        <Image style={styles.bursar} source={IMAGE.bursar} />
        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#9CA3AF" />
          <Text style={styles.locationText}>{property.location}</Text>
        </View>

        {/* View Property Button */}
        <Button
          size={ButtonSize.MEDIUM}
          style={{ width: 200, borderRadius: 8 }}
          onPress={() => {
            // if (onViewPress) {
            //   onViewPress?.()
            // } else {
            //   Alert.alert("sdfß")
            //   router.push("/properties")
            // }
            router.push(`/properties/${property.id}`)
          }} title={t('action.view_property')}
          iconPosition='right'
          icon={<Image width={20} height={20} style={{ width: 20, height: 20 }} source={IMAGE.forward_icon} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
    borderWidth: 1,
    padding: 0.5,
    borderColor: `#DDDDDD`,
    width: width - 20,
    marginHorizontal: 'auto',
  },
  imageContainer: {
    width: '100%',
    height: 200,
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
    padding: 10,
    paddingTop: 16,
    position: "relative"
  },
  propertyName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  bursar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 100,
    height: 150,
    zIndex: 999,
    pointerEvents: "none"
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
  viewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});