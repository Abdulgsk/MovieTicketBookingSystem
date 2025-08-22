import { api } from './api';
import { mockMovies, mockTheaters } from '../data/mockData';

// Helper function to combine and deduplicate arrays by ID
export const combineAndDeduplicate = (apiData, mockData, idField = 'id') => {
  const combined = [...(apiData || [])];
  const apiIds = new Set(apiData?.map(item => item[idField]?.toString()));
  
  // Add mock items that don't exist in API data
  mockData.forEach(mockItem => {
    if (!apiIds.has(mockItem[idField]?.toString())) {
      combined.push(mockItem);
    }
  });
  
  return combined;
};

export const movieService = {
  getMovies: async () => {
    try {
      const response = await api.get('/api/movies');
      const apiMovies = Array.isArray(response.data) ? response.data : [];
      return combineAndDeduplicate(apiMovies, mockMovies);
    } catch (error) {
      console.error('Error fetching movies, using mock data', error);
      return mockMovies; // Fallback to mock data if API fails
    }
  },
  
  getMovieById: async (id) => {
    if (!id) return null;
    
    try {
      // First try to get from API
      const response = await api.get(`/api/movies/${id}`);
      if (response.data) {
        return {
          ...response.data,
          id: response.data.id || response.data._id,
          _id: response.data._id || response.data.id
        };
      }
    } catch (error) {
      console.error(`Error fetching movie ${id} from API, checking mock data`, error);
    }
    
    // If API fails or returns no data, try mock data
    const mockMovie = mockMovies.find(movie => 
      movie.id === id || 
      movie._id === id ||
      movie.id?.toString() === id?.toString() ||
      movie._id?.toString() === id?.toString()
    );
    
    if (mockMovie) {
      return {
        ...mockMovie,
        id: mockMovie.id || mockMovie._id,
        _id: mockMovie._id || mockMovie.id
      };
    }
    
    return null;
  }
};

export const theaterService = {
  getTheaters: async (city) => {
    try {
      const response = await api.get('/api/theaters' + (city ? `?city=${city}` : ''));
      const apiTheaters = Array.isArray(response.data) ? response.data : [];
      return combineAndDeduplicate(apiTheaters, mockTheaters, 'id');
    } catch (error) {
      console.error('Error fetching theaters, using mock data', error);
      return city
        ? mockTheaters.filter(theater => 
            theater.location.toLowerCase().includes(city.toLowerCase()) ||
            theater.city?.toLowerCase() === city.toLowerCase()
          )
        : mockTheaters;
    }
  },
  
  getTheaterById: async (id) => {
    if (!id) return null;
    
    try {
      // First try to get from API
      const response = await api.get(`/api/theaters/${id}`);
      if (response.data) {
        return {
          ...response.data,
          id: response.data.id || response.data._id,
          _id: response.data._id || response.data.id
        };
      }
    } catch (error) {
      console.error(`Error fetching theater ${id} from API, checking mock data`, error);
    }
    
    // If API fails or returns no data, try mock data
    const mockTheater = mockTheaters.find(theater => 
      theater.id === id || 
      theater._id === id ||
      theater.id?.toString() === id?.toString() ||
      theater._id?.toString() === id?.toString()
    );
    
    if (mockTheater) {
      return {
        ...mockTheater,
        id: mockTheater.id || mockTheater._id,
        _id: mockTheater._id || mockTheater.id
      };
    }
    
    return null;
  }
};

// Export all services
export default {
  movie: movieService,
  theater: theaterService
};
