import React from 'react'
import { View } from 'react-native'
import ShimmerEffect from './ShimmerEffect'

export default function ButtonShimmer({ style }: { style?: any }) {
    return (
        <ShimmerEffect style={style}>
            <View style={{ width: '100%', height: '100%', backgroundColor: '#e0e0e0', borderRadius: 8 }} />
        </ShimmerEffect>
    )
}
