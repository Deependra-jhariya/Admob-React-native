import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { appImages } from '../../themes/AppImages/AppImages';
import { useAppNavigation } from '../../utils/navigationHelper';

const Splash = () => {
  const { replaceTo } = useAppNavigation();

  useEffect(() => {
    setTimeout(() => {
      replaceTo('Home');
    }, 2000);
  }, []);

  return (
    <View style={styles.imageContainer}>
      <Image source={appImages.splash} style={styles.img} />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  img: {
    height: 300,
    width: 300,
    resizeMode: 'contain',
  },
});
