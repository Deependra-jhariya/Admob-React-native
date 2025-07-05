import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AllStack from './src/navigatation/AllStack/AllStack'
import mobileAds from 'react-native-google-mobile-ads';
const App = () => {

   useEffect(() => {
    // ✅ Initialize AdMob SDK
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('✅ AdMob SDK initialized');
      });
  }, []);
  return (
   <>
   <AllStack/>
   </>
  )
}

export default App

const styles = StyleSheet.create({})