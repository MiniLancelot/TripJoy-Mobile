import { View, Text } from 'react-native'
import React from 'react'
import ColorList from '@/components/Others/ColorList'

const Trip = () => {
  return (
    <View  className='flex-1 bg-[#fff]'>
      <ColorList color='#0891b2' />
    </View>
  )
}

export default Trip