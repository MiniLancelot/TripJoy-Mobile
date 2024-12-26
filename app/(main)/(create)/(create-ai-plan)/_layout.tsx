import React from "react";
import { Stack } from "expo-router";




const _layout = () => {

  return (
    <Stack
      screenOptions={{
        headerShown: false,

      }}
    >
      {/* <Stack.Screen name="AiStep1" options={}/>
                <Stack.Screen name="Trip2"/>
                <Stack.Screen name="Trip3" options={{headerShown: true}}/> */}
    </Stack>
  );
};



export default _layout;
