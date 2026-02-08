
import { Image } from 'expo-image'
import React from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
interface SectionHeaderProps {
  title: string,
  icon?: any
  action?: () => void
  actionText?: string
}

const { width: screenWidth } = Dimensions.get('window');

export default function SectionHeader({ title, icon, action, actionText = 'View All' }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {icon && <View style={styles.iconWrapper}>
          <Image source={icon} style={styles.icon} />
        </View>}
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
      </View>
      {action && (
        <Pressable onPress={action}>
          <Text numberOfLines={1} style={styles.action}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: screenWidth - 20,
    marginHorizontal: 'auto',
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  iconWrapper: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#F7F5F3",
    borderRadius: 4,
    width: 32,
    height: 32,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 16,
    color: "#333333",
    fontFamily: 'Nunito-Italic',
    fontStyle: 'italic',
    fontWeight: "800",
    textTransform: "capitalize",
  },
  action: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "600",
    textTransform: "capitalize",
  }
})

// uses
//  <SectionHeader title='MY Properties' icon={IMAGE.property_icon}
//       action={() => console.log('View All')} actionText='View All' />