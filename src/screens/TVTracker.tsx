import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';
import tw from '../theme/tailwind';
import StyledButton from '../UIComponents/StyledButton';
import {navigationRef} from '../navigation/navigationRoot';
import {useMoviesAndShows} from '../hooks/useMoviesAndShows';
import {path_to_tmdbUri} from '../services/apiService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressBar, {renderProgressBar} from '../UIComponents/ProgressBar';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import useStore from '../store/useStore';

export default function TVTracker() {
  const {trackedShows, setSelectedShow, setSelectedType} = useMoviesAndShows();
const {adMobIds} =useStore()
  const renderEpisodeInfoButton = (numerator: number, denominator: number) => {
    return (
      <View style={tw`flex-1 flex-row items-center`}>
        <TouchableOpacity
          style={tw`bg-lightgrey px-2 py-2 justify-center items-center`}>
          <Text style={tw`text-white font-semibold `}>Episode info</Text>
        </TouchableOpacity>
        <Text style={tw`text-lightgrey ml-2 text-right`}>
          {denominator - numerator} left
        </Text>
      </View>
    );
  };

  const renderTrackedShowItem = (show: any) => {
    var seasonsWatched = show.seasons.filter(
      (s: any) => s.watched == true,
    ).length;
    var seasonsCount = show.seasons.length;
    console.log(seasonsWatched + ' ' + seasonsCount);
    if (show && show.poster_path)
      return (
        <TouchableOpacity
          key={show.id}
          style={tw`flex-col flex-1 w-full `}
          onPress={() => {
            setSelectedShow(show);
            navigationRef.navigate('ViewSeasonsScreen');
          }}>
          <View style={tw`w-full flex-row flex-1 py-3 `}>
            <ImageBackground
              source={{uri: path_to_tmdbUri(show.poster_path, 'low')}}
              resizeMode="cover"
              imageStyle={tw`rounded-3`}
              style={tw`w-15 h-22 flex-row`}
            />

            <View key={1} style={tw`flex-col mx-3 flex-1`}>
              <Text style={tw`text-white  text-base font-semibold`}>
                {show.name}
              </Text>
              <ProgressBar
                numerator={seasonsWatched}
                denominator={seasonsCount}
              />
              {renderEpisodeInfoButton(seasonsWatched, seasonsCount)}
            </View>
          </View>
          <View style={tw`border-t border-lightgrey h-0 mx-15 my-1`} />
        </TouchableOpacity>
      );
  };

  return (
    <View style={tw`bg-black h-full w-full `}>
      {adMobIds?.ADMOB_BANNER_HOME && <BannerAd unitId={adMobIds?.ADMOB_BANNER_HOME} size={BannerAdSize.FULL_BANNER}/>}
      {!trackedShows || trackedShows.length === 0 ? (
        <View style={tw`flex-1 w-full items-center justify-center`}>
          <Text style={tw`text-lightgrey text-center`}>
            No Tracked TV Shows.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={tw`h-full w-full `}
          contentContainerStyle={tw`mx-2 my-2`}>
          {trackedShows.map(show => renderTrackedShowItem(show))}
        </ScrollView>
      )}
      <View style={tw`mt-auto justify-center items-center`}>
        <StyledButton
          title={'Add TV Show'}
          onPress={() => {
            setSelectedType('TVSHOWS');
            navigationRef.navigate('Find');
          }}
        />
      </View>
    </View>
  );
}
