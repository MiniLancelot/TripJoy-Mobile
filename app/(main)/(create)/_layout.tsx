import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack screenOptions={{headerTitleAlign: 'center', headerShadowVisible: false, headerLargeTitle: true, headerShown: false}}>
        <Stack.Screen name="Trip1"/>
        <Stack.Screen name="Trip2"/>
    </Stack>
  )
}

export default Layout