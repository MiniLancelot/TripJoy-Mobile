import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack screenOptions={{headerTitleAlign: 'center', headerShadowVisible: false, headerLargeTitle: true, headerShown: true}}>
        <Stack.Screen name="Trip1"/>
        <Stack.Screen name="Trip2"/>
        <Stack.Screen name="Trip3" options={{headerShown: true}}/>
    </Stack>
  )
}

export default Layout