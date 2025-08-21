import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import Button from '../common/Button';

const Hero = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl || movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            {movie.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            {movie.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => navigate(`/movies/${movie._id}`)}
              size="lg"
              className="animate-fade-in-up"
            >
              Book Tickets
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 animate-fade-in-up"
              icon={<Play className="h-5 w-5" />}
            >
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
