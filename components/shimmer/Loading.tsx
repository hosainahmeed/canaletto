import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { ThemedText } from '../themed-text'

export default function Loading({ message = "Loading" ,color }: { message?: string , color?: string }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={'small'} color={color} />
            <ThemedText style={{ color }} type="defaultSemiBold">{message}</ThemedText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
})