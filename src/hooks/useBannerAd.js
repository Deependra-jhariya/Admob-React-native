import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { View, StyleSheet } from 'react-native';

const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy'; // Replace with your real ad unit ID

export const useBannerAd = (customUnitId = BANNER_AD_UNIT_ID) => {
  const BannerAdComponent = () => (
    <View style={styles.container}>
      <BannerAd
        unitId={customUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );

  return { BannerAdComponent };
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
