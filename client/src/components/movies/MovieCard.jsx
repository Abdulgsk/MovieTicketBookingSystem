  import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import { Star } from 'lucide-react';
  import Button from '../common/Button';

  const MovieCard = ({ movie }) => {
    // console.log('Featured moive',movie);
    const navigate = useNavigate();

    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-80 object-cover"
          />
          <div className="absolute top-2 right-2 bg-yellow-500 rounded-full px-2 py-1 flex items-center text-xs font-bold text-white">
            <Star className="h-3 w-3 mr-1 fill-current" />
            {movie.rating}
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold mb-1 truncate">{movie.title}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <span>{movie.duration} min</span>
            <span className="mx-2">•</span>
            <span>{movie.language}</span>
          </div>
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {(movie.genre?.slice(0, 3) || []).map((genre, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {movie.description}
          </p>
          <div className="mt-auto">
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(`/movies/${movie._id || movie.id}`)}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    );
  };

  export default MovieCard;
