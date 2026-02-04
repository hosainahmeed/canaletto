import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export enum SafeAreaEdge {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}
export default function SafeAreaViewWithSpacing({ children, edges = [SafeAreaEdge.TOP] }: { children: React.ReactNode; edges?: SafeAreaEdge[] }) {
  return (
    <SafeAreaView
      style={styles.container}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})