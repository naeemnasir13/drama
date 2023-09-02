/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import RootStackNavigator, {
  navigationRef,
} from './src/navigation/navigationRoot';
import { QueryClient, QueryClientProvider } from 'react-query';
import Toast from 'react-native-toast-message';
import BootSplash from "react-native-bootsplash";

import PushNotification from 'react-native-push-notification';
import { useAdMobService } from './src/services/adMobService';
function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const queryClient = new QueryClient();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
 const adLoaded =  useAdMobService();
 if(adLoaded) {
 BootSplash.hide({fade:true,})
 } 
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navigationRef}>
        {RootStackNavigator()}
      </NavigationContainer>
      <Toast position="bottom" />
    </QueryClientProvider>
  );
}

export default App;
