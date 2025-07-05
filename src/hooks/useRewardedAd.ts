import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

type UseRewardedAdHook = {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  showAd: () => Promise<boolean>;
  loadAd: () => void;
};

export function useRewardedAd(onEarnReward?: (type: string, amount: number) => void): UseRewardedAdHook {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rewardedRef = useRef<RewardedAd | null>(null);
  const retryCountRef = useRef<number>(0);
  const lastShownRef = useRef<number>(0);

  const MAX_RETRIES = 3;
  const MIN_INTERVAL_MS = 60000; // 1 minute

  const REAL_REWARDED_AD_UNIT_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx';
  const adUnitId = __DEV__ ? TestIds.REWARDED : REAL_REWARDED_AD_UNIT_ID;

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const initTimer = setTimeout(() => {
      initializeAd();
    }, 2000);

    return () => {
      clearTimeout(initTimer);
      rewardedRef.current = null;
    };
  }, []);

  const initializeAd = () => {
    console.log('🔧 Initializing rewarded ad...');

    const rewarded = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const onLoaded = rewarded.addAdEventListener(AdEventType.LOADED, () => {
      console.log('✅ Rewarded ad loaded');
      setIsLoaded(true);
      setIsLoading(false);
      setError(null);
      retryCountRef.current = 0;
    });

    const onError = rewarded.addAdEventListener(AdEventType.ERROR, (err) => {
      console.warn('❌ Rewarded ad error:', err.message);
      setIsLoaded(false);
      setIsLoading(false);
      setError(err.message);

      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        const retryDelay = 3000 * retryCountRef.current;

        setTimeout(() => {
          if (rewardedRef.current && !isLoading) {
            console.log(`🔁 Retrying load (attempt ${retryCountRef.current})`);
            loadAd();
          }
        }, retryDelay);
      }
    });

    const onClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('🙈 Rewarded ad closed');
      setIsLoaded(false);
      lastShownRef.current = Date.now();

      setTimeout(() => {
        retryCountRef.current = 0;
        loadAd();
      }, 10000);
    });

    const onRewarded = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('🎁 User earned reward:', reward);
        if (onEarnReward) {
          onEarnReward(reward.type, reward.amount);
        }
      }
    );

    rewardedRef.current = rewarded;

    setTimeout(() => {
      loadAd();
    }, 3000);

    return () => {
      onLoaded();
      onError();
      onClosed();
      onRewarded();
    };
  };

  const loadAd = () => {
    if (!rewardedRef.current || isLoading || Platform.OS === 'web') return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('📡 Loading rewarded ad...');
      rewardedRef.current.load();
    } catch (err) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Failed to load rewarded ad';
      console.error('❌ Load error:', msg);
      setError(msg);
    }
  };

  const showAd = async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;

    const now = Date.now();
    const timeSinceLastAd = now - lastShownRef.current;

    if (timeSinceLastAd < MIN_INTERVAL_MS) {
      console.log(`⏳ Too soon: Only ${timeSinceLastAd / 1000}s since last rewarded ad`);
      return false;
    }

    if (!isLoaded || !rewardedRef.current) {
      console.log('⚠️ Rewarded ad not loaded yet.');
      if (!isLoading && retryCountRef.current < MAX_RETRIES) {
        loadAd();
      }
      return false;
    }

    try {
      console.log('🚀 Showing rewarded ad...');
      await rewardedRef.current.show();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to show rewarded ad';
      console.error('❌ Show error:', msg);
      setError(msg);

      setTimeout(() => {
        if (rewardedRef.current && retryCountRef.current < MAX_RETRIES) {
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
