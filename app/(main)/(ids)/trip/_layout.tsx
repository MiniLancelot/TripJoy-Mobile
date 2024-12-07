import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const _layout = () => {
  return (
    <Tabs
    screenOptions={{
        headerTitleAlign: "center",
        headerShown: false,
        tabBarActiveTintColor: "#13c892",
        tabBarInactiveTintColor: "#737373",
        tabBarStyle: {
          paddingBottom: 2,
          height: 60,
          shadowColor: "blue",
        },
      }}>
        <Tabs.Screen name="[id]" options={{title: "Hello"}}/>
    </Tabs>
  )
}

export default _layout