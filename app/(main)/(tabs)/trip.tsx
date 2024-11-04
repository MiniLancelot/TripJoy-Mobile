import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ColorList from '@/components/Others/ColorList'
import Map from '@/components/Maps/Map'

const Trip = () => {
  return (
    <View style={styles.container}>
      {/* <ColorList color='#0891b2' /> */}
      <Map />
    </View>
  )
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 25
  }
})

export default Trip