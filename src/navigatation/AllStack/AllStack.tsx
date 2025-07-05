import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Home from '../../screens/Home/Home';
import Splash from '../../screens/Splash/Splash';

const Stack = createNativeStackNavigator();

const AllStack = () => {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName='Splash' screenOptions={{headerShown:false}}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AllStack

const styles = StyleSheet.create({})