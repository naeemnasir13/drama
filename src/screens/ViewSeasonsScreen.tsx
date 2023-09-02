import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {useMoviesAndShows} from '../hooks/useMoviesAndShows';
import {
  path_to_tmdbUri,
  useGetMovieDetails,
  useGetTvShowDetails,
} from '../services/apiService';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useState} from 'react';
import tw from '../theme/tailwind';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HeaderBar from '../UIComponents/HeaderBar';
import ShowCoverSection from '../UIComponents/ShowCoverSection';
import CheckBox from '@react-native-community/checkbox';
import ProgressBar from '../UIComponents/ProgressBar';
import {navigationRef} from '../navigation/navigationRoot';
export default function ViewMovieOrTVShowScreen() {
  const [selectedOption, setSelectedOption] = useState('CASTCREW');
  const [searchTermRef, setSearchTermRef] = useState<any>('');
  const {
    selectedShow,
    selectedShowID,
    selectedType,
    storeTVShow,
    getTrackedIndicator,
    loading,
    setSeasonWatched,
    setSelectedSeason,
  } = useMoviesAndShows();

  const safeArea = useSafeAreaInsets();
  function renderSeason(season: any) {
    var episodesCount = season.episodes.length;
    var episodesWatched = season.episodes.filter(
      (ep: any) => ep.watched == true,
    ).length;
    var seasonWatched = episodesWatched === episodesCount;
    return (
      <View
        key={season.season_number}
        style={tw` flex-1 flex-row  border-b border-lightgrey  h-15 w-full items-center`}>
        <View style={tw`w-5 h-5 mx-2 z-100 `}>
          <CheckBox
            value={seasonWatched}
            style={tw`w-5 h-5`}
            onValueChange={(value: boolean) => {
              setSeasonWatched(season.season_number, value);
            }}
          />
        </View>
        <TouchableOpacity
          style={tw`flex-1 flex-row`}
          onPress={() => {
            setSelectedSeason(season);
            navigationRef.navigate('ViewEpisodesScreen');
          }}>
          <Text style={tw`text-white ml-4`}>{season.name}</Text>
          <View style={tw`pl-2 flex-1`}>
            <ProgressBar
              numerator={episodesWatched}
              denominator={episodesCount}
            />
          </View>
          <Ionicons
            name="ios-chevron-forward"
            size={20}
            color={'white'}
            style={tw`ml-2 mr-2`}
          />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View
      style={[tw`bg-black h-full w-full  `, {paddingBottom: safeArea.bottom}]}>
      <HeaderBar
        text={
          selectedShow.title
            ? selectedShow.title
            : selectedShow.name
            ? selectedShow.name
            : ''
        }
        plusAction={() => storeTVShow(selectedShow, false)}
        tracked={true}
        loading={loading}
      />
      <View style={tw` w-full flex-1`}>
        <ScrollView
          style={[tw` flex w-full flex-col `]}
          showsHorizontalScrollIndicator={false}>
          <ShowCoverSection
            detailsData={selectedShow}
            selectedType={'TVSHOWS'}
          />
          <View style={tw`flex-col  mx-2`}>
            <Text style={tw`text-white text-2xl font-bold mt-2 mb-2`}>
              Seasons
            </Text>
            {selectedShow.seasons &&
              selectedShow.seasons.map((season: any) => {
                return renderSeason(season);
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
