import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Dropdown from '@/components/Others/Dropdown'
import AnimationTextInput from '@/components/TextInput/MyTextInput'

const DropdownTest = () => {
  return (
    <View>
      <Dropdown/>
      <View style={[{flex:1, padding:10, alignItems:'center',  margin:10}]}>
      <AnimationTextInput placeholder='testing' style={[styles.usernameInput]}/>
      <AnimationTextInput placeholder='testing2' style={[styles.usernameInput]}/>
      </View>
    </View>
  )
}

export default DropdownTest

const styles = StyleSheet.create({
  usernameInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1.2,
    margin: 10,
    padding: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 55,
    fontSize: 18,
    lineHeight: 28,
    paddingRight: 90,
    fontWeight: "500",
  },
  outerUsernameInput: {
    flexDirection: "row",
    alignItems: "center",
  },
})

