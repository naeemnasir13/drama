import mobileAds from 'react-native-google-mobile-ads';
import { AppOpenAd, InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { getAdIds } from './apiService';
import useStore from '../store/useStore';
import React from 'react';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const useAdMobService = () => {
  const { setAdMobIds } = useStore()
  const [loaded, setLoaded] = React.useState(false);
  const [interstitialAd, setInterstitialAd] = React.useState<InterstitialAd>();

  const adMobInit = async () => {
    let options = { requestNonPersonalizedAdsOnly: false }
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
    switch (result) {
      case RESULTS.DENIED: {
        await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        return true
      }
      case RESULTS.LIMITED:
        options.requestNonPersonalizedAdsOnly = true
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        options.requestNonPersonalizedAdsOnly = true
        break;
    }
    await mobileAds().initialize();
    let getAdMobIds = await getAdIds()
    setAdMobIds({ ...getAdMobIds })
    if (!getAdMobIds?.ADMOB_INTER_SPLASH) { return }
    setInterstitialAd(InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, { ...options }))

  }

  adMobInit()

  React.useEffect(() => {
    if (!interstitialAd) {
      return
    }
    console.log('useEffect');

    const unsubscribe = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      interstitialAd.show();
      setLoaded(true);
    });

    // Start loading the interstitial straight away
    interstitialAd.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [interstitialAd])

  return loaded;
}
