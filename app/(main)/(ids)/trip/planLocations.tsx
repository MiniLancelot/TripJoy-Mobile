import { View, Text } from 'react-native'
import React from 'react'
import { useTabStore } from '@/utils/store'

const planLocations = () => {
    const sharedId = useTabStore((state) => state.sharedId);

  return (
    <View style={{flex: 1}}>
      <Text style={{marginTop: 20}}>planLocation</Text>
      {sharedId ? (
        <Text>Shared ID: {sharedId}</Text>
      ) : (
        <Text>No ID Passed</Text>
      )}
    </View>
  )
}

export default planLocations