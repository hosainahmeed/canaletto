import React from 'react'
import { View } from 'react-native'
import ShimmerEffect from './ShimmerEffect'

export default function AvaterShimmer({ shape }: { shape: "circle" | "square" }) {
    return (
        <ShimmerEffect style={{ width: 40, height: 40  }}>
            <View style={{ width: 40, height: 40, backgroundColor: '#e0e0e0', borderRadius: shape === 'circle' ? 20 : 8 }} />
        </ShimmerEffect>
    )
}
