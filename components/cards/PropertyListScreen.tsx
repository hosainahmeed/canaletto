import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import PropertyCard from './PropertyCard';

export default function PropertyListScreen() {
  const properties = [
    {
      id: '1',
      name: 'The Wilds Project',
      location: 'Abu Dhabi, Al Hudayriat Island, Bashayer Villas',
      image: require('../../assets/images/property1.png'),
    },
    {
      id: '2',
      name: 'Modern Villa Estate',
      location: 'Dubai, Palm Jumeirah, Frond A',
      image: require('../../assets/images/property2.png'),
    },
    {
      id: '3',
      name: 'Luxury Beachfront',
      location: 'Abu Dhabi, Saadiyat Island, Cultural District',
      image: require('../../assets/images/property3.png'),
    },
  ];

  const handleViewProperty = (propertyId: string) => {
    console.log('View property:', propertyId);
    // Navigate to property details
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onViewPress={() => handleViewProperty(property.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    paddingVertical: 16,
  },
});