import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{
        headerTitleAlign: "center",
        // headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: true,
        headerShown: true,
    }} />
  )
}

export default _layout