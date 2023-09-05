import mobileAds from 'react-native-google-mobile-ads';
import { AppOpenAd, InterstitialAd, AdEventType, TestIds, BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getAdIds } from './apiService';
import useStore from '../store/useStore';
import React from 'react';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { AppState } from 'react-native';

export const useAdMobService = () => {
  const { setAdMobIds, adMobIds } = useStore()
  const [loaded, setLoaded] = React.useState(false);
  const [interstitialAd, setInterstitialAd] = React.useState<InterstitialAd>();
  const appState = React.useRef(AppState.currentState);
  let options = { requestNonPersonalizedAdsOnly: false }

  const adMobInit = async () => {
    await mobileAds().initialize().catch(err => console.log(err));
    let getAdMobIds = await getAdIds().catch(err => console.log(err))
    setAdMobIds({ ...getAdMobIds })
    if (!getAdMobIds?.ADMOB_INTER_SPLASH) {
      setLoaded(true);
      return;
    }
    const checkPermission = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
    let reqResult = 'denied'
    switch (checkPermission) {
      case RESULTS.DENIED: 
        reqResult =  await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        break;
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
   console.log(reqResult)
    if(reqResult!==RESULTS.DENIED || checkPermission!==RESULTS.DENIED){
      let interstitialAdInit =InterstitialAd.createForAdRequest(getAdMobIds?.ADMOB_INTER_SPLASH, { ...options })
      setInterstitialAd(interstitialAdInit)
    }
  }
  React.useEffect(() => {
    adMobInit()
  }, [])

  React.useEffect(() => {
    console.log('OPEN_ADS',adMobIds?.OPEN_ADS)
    if (!adMobIds?.OPEN_ADS) {
      return;
    }

    let appOpenAd = AppOpenAd.createForAdRequest(adMobIds?.OPEN_ADS, { ...options });
    
    const subscription = AppState.addEventListener('change', async(nextAppState) => {    
    const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
    if(result==RESULTS.DENIED){
      return
    }
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {          console.log('App has come to the foreground!');

        appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
          appOpenAd.show();
        })
      }
          if(nextAppState.match(/background/)){
          appOpenAd.load();

          }
      appState.current = nextAppState;

    });

    return () => {
      subscription.remove();
    };
  }, [adMobIds?.OPEN_ADS])

  React.useEffect(() => {
    if (!interstitialAd) {
      return
    }    
    console.log('adMob useEffect');
    const unsubscribe = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      interstitialAd.show();
      setLoaded(true);
    });
    interstitialAd.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, [interstitialAd])

  return loaded;
}
