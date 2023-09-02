import {useQuery} from 'react-query';

const TMDB_API_KEY = '54ed8b21fd2d7a380faaa388189b382f';

export const fetchApi = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return response.json();
};

export const useGetAppConfig = () => {
  return useQuery('appConfig', async () => {
    const config = await fetchApi(
      'http://teslamobileapp.com:3000/users/movie8',
    );
    return config.json();
  });
};

export const useSearch = (query: string, type: string, page = 1) => {
  return useQuery(['search', query, type, page], async () => {
    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&language=en-US&query=${query}&page=${page}&include_adult=false`;
    return fetchApi(url);
  });
};

export const useGetTVTime = (date: string, country = 'us') => {
  return useQuery(['tvTime', date, country], async () => {
    const url = `http://api.tvmaze.com/schedule?&date=${date}&country=${country}`;
    return fetchApi(url);
  });
};

export const useGetDiscoverMovies = (genre = '') => {
  return useQuery(['discoverMovies', genre], async () => {
    const genreFilter = genre === '' ? '' : `&with_genres=${genre}`;
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&${genreFilter}&language=en-US&page=1&include_adult=false&include_video=true&vote_average.gte=1&vote_count.gte=10`;
    return fetchApi(url);
  });
};

export const useGetDiscoverTv = (genre = '') => {
  return useQuery(['discoverTv', genre], async () => {
    const genreFilter = genre === '' ? '' : `&with_genres=${genre}`;
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&${genreFilter}&language=en-US&page=1&include_adult=false&include_video=true&vote_average.gte=1&vote_count.gte=10`;
    return fetchApi(url);
  });
};

export const useGetMovieDetails = (movieId: string, basic = false) => {
  return useQuery(['movieDetails', movieId, basic], async () => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US,null&page=1&include_adult=false${
      basic
        ? ''
        : '&append_to_response=videos,credits,similar,images&include_image_language=en,null'
    }`;
    return fetchApi(url);
  });
};

export const useGetMovieSimilar = (movieId: string) => {
  return useQuery(['movieSimilar', movieId], async () => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false&append_to_response=videos,credits`;
    return fetchApi(url);
  });
};

export const useGetTvShowDetails = (tvShowId: string, basic = false) => {
  return useQuery(['tvShowDetails', tvShowId, basic], async () =>
    getTvShowDetails(tvShowId),
  );
};

export const useGetTvShowSimilar = (tvShowId: string) => {
  return useQuery(['tvShowSimilar', tvShowId], async () => {
    const url = `https://api.themoviedb.org/3/tv/${tvShowId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false&append_to_response=videos,credits`;
    return fetchApi(url);
  });
};
export const useGetTvShowEpisodes = (tvShowId: string) => {
  console.log(`Here getting episode details ${tvShowId}`);
  return useQuery(['tvShowSimilar', tvShowId], async () => {
    const url = `https://api.themoviedb.org/3/tv/${tvShowId}/episode_groups?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false`;
    return fetchApi(url);
  });
};

export const useGetTrendingMovies = (page: number) => {
  return useQuery(['trendingMovies', page], async () => {
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=false`;
    return fetchApi(url);
  });
};

export const useGetTrendingTvShows = (page = 1) => {
  return useQuery(['trendingTvShows', page], async () => {
    const url = `https://api.themoviedb.org/3/trending/tv/week?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=false&append_to_response=seasons`;
    return fetchApi(url);
  });
};

export const useGetTopRatedMovies = (page: number) => {
  return useQuery(['topRatedMovies', page], async () => {
    const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=false&append_to_response=videos`;
    return fetchApi(url);
  });
};

export const useGetOnAirTV = (page: number) => {
  return useQuery(['onAirTV', page], async () => {
    const url = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=false&append_to_response=videos`;
    return fetchApi(url);
  });
};

export const useGetTopRatedTvShows = (page = 1) => {
  return useQuery(['topRatedTvShows', page], async () => {
    const url = `https://api.themoviedb.org/3/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=false&append_to_response=videos`;
    return fetchApi(url);
  });
};

export const useGetLatestMovies = (page: number) => {
  return useQuery(['latestMovies', page], async () => {
    const url = `https://api.themoviedb.org/3/movie/latest?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=false&append_to_response=videos`;
    return fetchApi(url);
  });
};

export const useGetLatestTvShows = (page: number) => {
  return useQuery(['latestTvShows', page], async () => {
    const url = `https://api.themoviedb.org/3/tv/latest?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=false&append_to_response=videos`;
    return fetchApi(url);
  });
};

export const useGetNowPlayingMovies = (page: string) => {
  return useQuery(['nowPlayingMovies', page], async () => {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=false&append_to_response=videos`;
    return fetchApi(url);
  });
};

export const useGetUpcomingMovies = (page: string) => {
  return useQuery(['upcomingMovies', page], async () => {
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=false&append_to_response=videos`;
    return fetchApi(url);
  });
};

export const useGetMovieGenres = () => {
  return useQuery('movieGenres', async () => {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;
    return fetchApi(url);
  });
};

export const useGetTvGenres = () => {
  return useQuery('tvGenres', async () => {
    const url = `https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`;
    return fetchApi(url);
  });
};

export const useGetActor = (actorId: string) => {
  return useQuery(['actor', actorId], async () => {
    const url = `https://api.themoviedb.org/3/person/${actorId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos`;
    return fetchApi(url);
  });
};

export const useGetActorProfiles = (actorId: string) => {
  return useQuery(['actorProfiles', actorId], async () => {
    const url = `https://api.themoviedb.org/3/person/${actorId}/images?api_key=${TMDB_API_KEY}`;
    return fetchApi(url);
  });
};

export const useGetActorMovies = (actorId: string) => {
  return useQuery(['actorMovies', actorId], async () => {
    const url1 = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`;
    const url2 = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_people=${actorId}&language=en-US`;
    const [movies1, movies2] = await Promise.all([
      fetchApi(url1),
      fetchApi(url2),
    ]);
    return {
      movies1,
      movies2,
    };
  });
};

export const useFindById = (externalId: string) => {
  return useQuery(['findById', externalId], async () => {
    const url = `https://api.themoviedb.org/3/find/${externalId}?api_key=${TMDB_API_KEY}&language=en-US&external_source=imdb_id`;
    return fetchApi(url);
  });
};

export const useMovieSearch = (query: string) => {
  console.log('QUERY:', query);
  return useQuery(['movieSearch', query], async () => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&include_adult=false`;
    return fetchApi(url);
  });
};

export const useTvSearch = (query: string) => {
  return useQuery(['tvSearch', query], async () => {
    const url = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${query}&include_adult=false`;
    return fetchApi(url);
  });
};

const BASE_IMAGE_API = 'https://image.tmdb.org/t/p/w500';
const LOW_RES_IMAGE_API = 'https://image.tmdb.org/t/p/w200';

export const path_to_tmdbUri = (path: string, quality: string | null) =>
  quality
    ? quality == 'low'
      ? `${LOW_RES_IMAGE_API}${path}`
      : null
    : `${BASE_IMAGE_API}${path}`;

export const getTvShowEpisodes = async (tvShowID: string, season: string) => {
  const url = `https://api.themoviedb.org/3/tv/${tvShowID}/season/${season}?api_key=54ed8b21fd2d7a380faaa388189b382f`;
  const response = await fetchApi(url);
  return response;
};

export const getTvShowDetails = (tvShowId: string, basic = false) => {
  const url = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${TMDB_API_KEY}&language=en-US&page=1&include_adult=false${
    basic
      ? ''
      : '&append_to_response=videos,credits,similar,images&include_image_language=en,null'
  }`;
  return fetchApi(url);
};

export const movieSearch = (query: string) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&include_adult=false`;
  return fetchApi(url);
};

export const tvSearch = (query: string) => {
  const url = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${query}&include_adult=false`;
  return fetchApi(url);
};
export const getAdIds = () => {
    return fetchApi('http://teslamobileapp.com:3000/users/movie12')
}