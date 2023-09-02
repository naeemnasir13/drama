import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CountdownScreen from '../screens/CountdownScreen';
import MoreScreen from '../screens/MoreScreen';

import TVTracker from '../screens/TVTracker';
import tw from '../theme/tailwind';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {theme} from '../theme/tailwind.config';
import FindScreen from '../screens/FindScreen';
const Tab = createBottomTabNavigator();

function TabStackNavigator() {
  var headerOptions = {
    headerShown: true,
    headerStyle: tw`bg-header`,
    headerTitleStyle: tw`text-white text-sm`,
  };
  return (
    <Tab.Navigator
      screenOptions={({route}: any) => ({
        tabBarIcon: ({focused}: any) => {
          let icon;

          if (route.name === 'TV Tracker') {
            icon = (
              <Ionicons
                name="md-tv-outline"
                color={
                  focused
                    ? theme.extend.colors.tertiary
                    : theme.extend.colors.secondary
                }
                size={20}
              />
            );
          } else if (route.name === 'Countdown') {
            icon = (
              <MaterialCommunityIcons
                name="history"
                color={
                  focused
                    ? theme.extend.colors.tertiary
                    : theme.extend.colors.secondary
                }
                size={20}
              />
            );
          } else if (route.name === 'Find') {
            icon = (
              <Ionicons
                name="search"
                color={
                  focused
                    ? theme.extend.colors.tertiary
                    : theme.extend.colors.secondary
                }
                size={20}
              />
            );
          } else if (route.name === 'More') {
            icon = (
              <Ionicons
                name="ellipsis-horizontal"
                color={
                  focused
                    ? theme.extend.colors.tertiary
                    : theme.extend.colors.secondary
                }
                size={20}
              />
            );
          }

          return icon;
        },
        tabBarStyle: tw`bg-primary `,
      })}>
      <Tab.Screen
        name="TV Tracker"
        component={TVTracker}
        options={headerOptions}
      />
      <Tab.Screen
        name="Countdown"
        component={CountdownScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Find" component={FindScreen} options={headerOptions} />
      <Tab.Screen name="More" component={MoreScreen} options={headerOptions} />
    </Tab.Navigator>
  );
}

export default TabStackNavigator;
