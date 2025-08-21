import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import Hero from '../components/home/Hero';
import MovieCard from '../components/movies/MovieCard';
import { Link } from 'react-router-dom';
import MovieCarousel from '../components/movies/MovieCarousel';
import { movieService } from '../utils/dataService';

const Home = () => {
  // const [featuredMovie, setFeaturedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movieData = await movieService.getMovies();
        setMovies(movieData);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      {movies.length > 0 && <MovieCarousel movies={movies.slice(0, 5)} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
              Now Showing
            </h2>
            <Link to="/movies" className="text-red-600 hover:text-red-700 font-medium">View All</Link>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.slice(0, 4).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
             <Link to="/movies" className="text-red-600 hover:text-red-700 font-medium">View All</Link>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.slice(4, 8).map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-8 mb-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Subscribe for Updates</h2>
            <p className="text-gray-600 mb-6">
              Get the latest movie releases and special offers delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
