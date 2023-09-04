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
import {theme} from '../theme/tailwind.config';
import HeaderBar from '../UIComponents/HeaderBar';
import ToggleButton from '../UIComponents/ToggleButton';
import ShowCoverSection from '../UIComponents/ShowCoverSection';
import useStore from '../store/useStore';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

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
  } = useMoviesAndShows();

  const safeArea = useSafeAreaInsets();

  const MovieInfoToggle = () => {
    return (
      <View style={tw`items-center flex-row w-full rounded-2 my-2`}>
        {ToggleButton('Cast & Crew', selectedOption == 'CASTCREW', 1, () =>
          setSelectedOption('CASTCREW'),
        )}
        {ToggleButton('Trailer', selectedOption == 'TRAILER', 2, () =>
          setSelectedOption('TRAILER'),
        )}
        {ToggleButton('Discover', selectedOption == 'DISCOVER', 10, () =>
          setSelectedOption('DISCOVER'),
        )}
      </View>
    );
  };

  const useGetDetails =
    selectedType === 'TVSHOWS' ? useGetTvShowDetails : useGetMovieDetails;

  const {
    data: detailsData,
    isLoading: detailsLoading,
    isError: detailsError,
    error: detailsErrorData,
  } = useGetDetails(selectedShowID);
  const {adMobIds} = useStore()
  return (
    <View
      style={[tw`bg-black h-full w-full  `, {paddingBottom: safeArea.bottom}]}>
      <HeaderBar
        text={
          detailsData?.title
            ? detailsData.title
            : detailsData?.name
            ? detailsData.name
            : ''
        }
        plusAction={() => storeTVShow(detailsData, false)}
        tracked={getTrackedIndicator(selectedShow)}
        loading={loading}
      />
      <View style={tw` w-full flex-1`}>
      {adMobIds?.ADMOB_BANNER_DETAIL && <View style={tw`w-full items-center justify-center`}><BannerAd unitId={adMobIds?.ADMOB_BANNER_DETAIL} size={BannerAdSize.BANNER} /></View>}

        {detailsLoading ? (
          <View style={tw`h-full w-full  justify-center items-center`}>
            {/* <ActivityIndicator
              color={theme.extend.colors.lightgrey}
              size={'large'}
            /> */}
          </View>
        ) : detailsError ? (
          <View style={tw`h-full w-full bg-black justify-center items-center`}>
            <Text style={tw`text-lightgrey text-lg text-center`}>
              An error occured while retrieving the movie details.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={[tw` flex w-full flex-col `]}
            showsHorizontalScrollIndicator={false}>
            <ShowCoverSection
              detailsData={detailsData}
              selectedType={selectedType}
            />
            <View style={tw`mx-2 `}>
              <Text style={tw`text-white text-sm mt-2 mb-2`}>
                {detailsData.overview}
              </Text>
              <View style={tw`my-2 flex-row`}>
                {detailsData.genres.map(genre => {
                  return (
                    <View
                      key={genre.id}
                      style={tw`bg-lightgrey rounded-4 mr-3 `}>
                      <Text style={tw`text-white px-3 py-2`}>{genre.name}</Text>
                    </View>
                  );
                })}
              </View>
              <Text style={tw`text-white text-base font-semibold mt-2 mb-2`}>
                Status: {detailsData.status}
              </Text>
              {MovieInfoToggle()}
              {selectedOption == 'CASTCREW' ? (
                <View style={tw`mx-1`}>
                  {detailsData.credits.cast.map(castItem => {
                    return (
                      <View
                        key={castItem.id}
                        style={tw`w-full border flex-row items-center border-black my-2`}>
                        <ImageBackground
                          source={{
                            uri: path_to_tmdbUri(castItem.profile_path, 'low'),
                          }}
                          resizeMode="cover"
                          imageStyle={tw`rounded rounded-2`}
                          style={tw`w-16 h-26 flex-row `}></ImageBackground>
                        <View style={tw`mx-2 justify-around`}>
                          <Text style={tw`text-white text-base font-extrabold`}>
                            {castItem.original_name}
                          </Text>
                          <Text
                            style={tw`text-lightgrey font-semibold text-sm`}>
                            {castItem.character}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : selectedOption == 'TRAILER' ? (
                <View>
                  {detailsData.videos.results.map(videoItem => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(
                            `https://www.youtube.com/watch?v=${videoItem.key}`,
                          );
                        }}
                        key={videoItem.id}
                        style={tw`w-full mr-2 pr-5 flex-row items-center  my-2`}>
                        <ImageBackground
                          source={require('../assets/movieset.jpg')}
                          resizeMode="cover"
                          imageStyle={tw`rounded rounded-2`}
                          style={tw`w-30 h-15 flex-row `}></ImageBackground>
                        <View style={tw`flex-1 mx-2 justify-around`}>
                          <Text style={tw`text-white font-extrabold`}>
                            {videoItem.name}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={tw`w-full border-blue`}>
                  <Text style={tw`text-xs text-lightgrey text-center my-2`}>
                    Production
                  </Text>
                  <View style={tw`flex-row`}>
                    <View style={tw`bg-lightgrey rounded-4 mr-3 `}>
                      <Text style={tw`text-white px-3 py-2 text-xs`}>
                        aniventure
                      </Text>
                    </View>
                    <View style={tw`bg-lightgrey rounded-4 mr-3 `}>
                      <Text style={tw`text-white px-3 py-2  text-xs`}>
                        Align
                      </Text>
                    </View>
                  </View>
                  <Text style={tw`text-xs text-lightgrey text-center my-2`}>
                    Keywords
                  </Text>
                  <View style={tw`flex-row`}>
                    <View style={tw`bg-lightgrey rounded-4 mr-3 `}>
                      <Text style={tw`text-white px-3 py-2 text-xs`}>cat</Text>
                    </View>
                    <View style={tw`bg-lightgrey rounded-4 mr-3 `}>
                      <Text style={tw`text-white px-3 py-2  text-xs`}>dog</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
