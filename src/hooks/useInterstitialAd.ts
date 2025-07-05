import { useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

type UseInterstitialAdHook = {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  showAd: () => Promise<boolean>;
  loadAd: () => void;
};

export function useInterstitialAd(): UseInterstitialAdHook {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interstitialRef = useRef<InterstitialAd | null>(null);
  const lastShownRef = useRef<number>(0);
  const retryCountRef = useRef<number>(0);

  const MAX_RETRIES = 3;
  const MIN_INTERVAL_MS = 60 * 1000; // 1 minute between ads

  const REAL_INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx';
  const adUnitId = __DEV__
    ? TestIds.INTERSTITIAL
    : REAL_INTERSTITIAL_AD_UNIT_ID;

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const initTimer = setTimeout(() => {
      initializeAd();
    }, 2000);

    return () => {
      clearTimeout(initTimer);
      interstitialRef.current = null;
    };
  }, []);

  const initializeAd = () => {
    console.log('🔧 Initializing interstitial ad...');

    const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const onLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('✅ Interstitial loaded');
      setIsLoaded(true);
      setIsLoading(false);
      setError(null);
      retryCountRef.current = 0;
    });

    const onError = interstitial.addAdEventListener(AdEventType.ERROR, (err) => {
      console.warn('❌ Interstitial error:', err.message);
      setIsLoaded(false);
      setIsLoading(false);
      setError(err.message);

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        const retryDelay = 3000 * retryCountRef.current;

        setTimeout(() => {
          if (interstitialRef.current && !isLoading) {
            console.log(`🔁 Retrying to load ad (attempt ${retryCountRef.current})`);
            loadAd();
          }
        }, retryDelay);
      }
    });

    const onClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('🙈 Interstitial closed by user');
      setIsLoaded(false);
      lastShownRef.current = Date.now();

      setTimeout(() => {
        retryCountRef.current = 0;
        loadAd();
      }, 10000);
    });

    interstitialRef.current = interstitial;

    setTimeout(() => {
      loadAd();
    }, 3000);

    return () => {
      onLoaded();
      onError();
      onClosed();
    };
  };

  const loadAd = () => {
    if (!interstitialRef.current || isLoading || Platform.OS === 'web') return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('📡 Loading interstitial ad...');
      interstitialRef.current.load();
    } catch (err) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Failed to load ad';
      console.error('❌ Load error:', msg);
      setError(msg);
    }
  };

  const showAd = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;

    const now = Date.now();
    const timeSinceLastAd = now - lastShownRef.current;

    if (timeSinceLastAd < MIN_INTERVAL_MS) {
      console.log(`⏳ Too soon: Only ${timeSinceLastAd / 1000}s since last ad`);
      return false;
    }

    if (!isLoaded || !interstitialRef.current) {
      console.log('⚠️ Ad not loaded yet.');
      if (!isLoading && retryCountRef.current < MAX_RETRIES) {
        loadAd();
      }
      return false;
    }

    try {
      console.log('🚀 Showing interstitial ad...');
      await interstitialRef.current.show();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to show ad';
      console.error('❌ Show error:', msg);
      setError(msg);

      setTimeout(() => {
        if (interstitialRef.current && retryCountRef.current < MAX_RETRIES) {
          loadAd();
        }
      }, 5000);

      return false;
    }
  };

  return {
    isLoaded,
    isLoading,
    error,
    showAd,
    loadAd,
  };
}
