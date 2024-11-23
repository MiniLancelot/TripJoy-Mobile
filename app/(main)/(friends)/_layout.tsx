import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#fff" },
        headerShadowVisible: false,
        headerShown: false,
    }} />
  )
}

export default _layout