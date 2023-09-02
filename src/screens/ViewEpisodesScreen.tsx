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

import {useEffect, useState} from 'react';
import tw from '../theme/tailwind';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EpisodesHeaderBar from '../UIComponents/EpisodesHeaderBar';
import ShowCoverSection from '../UIComponents/ShowCoverSection';
import CheckBox from '@react-native-community/checkbox';
import ProgressBar from '../UIComponents/ProgressBar';
export default function ViewMovieOrTVShowScreen() {
  const [selectedOption, setSelectedOption] = useState('CASTCREW');
  const [searchTermRef, setSearchTermRef] = useState<any>('');
  const {selectedSeason, setSeasonWatched, setEpisodeWatched} =
    useMoviesAndShows();

  const [episodesWatchedCount, setEpisodesWatchedCount] = useState(0);
  const [totalEpisodes, setTotalEpisodes] = useState(1);

  const safeArea = useSafeAreaInsets();

  useEffect(() => {
    console.log('Selected season updated:');
    setEpisodesWatchedCount(
      selectedSeason.episodes.reduce((count, episode) => {
        if (episode.watched === true) {
          return count + 1;
        }
        return count;
      }, 0),
    );
    setTotalEpisodes(selectedSeason.episodes.length);
  }, [selectedSeason]);

  useEffect(() => {
    console.log(totalEpisodes);
    console.log(episodesWatchedCount);
  }, [totalEpisodes]);

  const renderEpisode = (episode: any) => {
    return (
      <TouchableOpacity
        key={episode.episode_number}
        style={tw` flex-1 flex-row  border-b border-lightgrey  h-15 w-full items-center`}>
        <View style={tw`flex-col  flex-1`}>
          <Text style={tw`text-white`}>{episode.name}</Text>
          <Text style={tw`text-white text-xs pt-1`}>{episode.air_date}</Text>
        </View>
        <View style={tw`w-5 h-5`}>
          <CheckBox
            value={episode.watched}
            style={tw`w-5 h-5`}
            onValueChange={(value: boolean) => {
              setEpisodeWatched(
                selectedSeason.season_number,
                episode.episode_number,
                value,
              );
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={[
        tw`bg-header h-full w-full flex-col  `,
        {paddingBottom: safeArea.bottom},
      ]}>
      <EpisodesHeaderBar
        selectionText={episodesWatchedCount > 0 ? 'Unselect All' : 'Select All'}
        selectionAction={() =>
          setSeasonWatched(
            selectedSeason.season_number,
            episodesWatchedCount == 0,
          )
        }
      />
      <View style={tw`w-full flex-1 px-2`}>
        <View style={tw`my-2 mx-2`}>
          <ProgressBar
            numerator={episodesWatchedCount}
            denominator={totalEpisodes}
          />
        </View>
        <ScrollView
          style={[tw` flex w-full flex-col `]}
          showsHorizontalScrollIndicator={false}>
          <View style={tw`flex-col  mx-2`}>
            {selectedSeason.episodes.map((episode: any) => {
              return renderEpisode(episode);
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
