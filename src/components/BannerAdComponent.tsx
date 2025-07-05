// components/BannerAdComponent.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

type Props = {
  adUnitId?: string; // Optional custom ad unit ID
  size?: BannerAdSize;
};

const BannerAdComponent: React.FC<Props> = ({
  adUnitId = __DEV__
    ? TestIds.BANNER
    : 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx', // replace with your real ID
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
}) => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 8,
  },
});

export default BannerAdComponent;
