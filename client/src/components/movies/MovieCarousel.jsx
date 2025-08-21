import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MovieCarousel = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === movies.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? movies.length - 1 : prevIndex - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isHovering) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovering, movies.length]);

  if (!movies.length) return null;

  return (
    <div 
     className="relative flex justify-center items-center h-[400px] md:h-[450px] lg:h-[500px] w-full mt-8"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slides */}
      <div className="relative w-[100%] md:w-[90%] lg:w-[80%] h-full overflow-hidden rounded-lg shadow-lg">
        {movies.map((movie, index) => (
          <div
            key={movie._id || movie.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
              <div className="max-w-lg">
                <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md mb-4">
                  Featured
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  {movie.title}
                </h2>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 mr-2">★ {movie.rating}/10</span>
                  <span className="text-gray-300 text-sm">
                    {movie.duration} • {movie.genres.slice(0, 3).join(', ')}
                  </span>
                </div>
                <p className="text-gray-300 mb-6 line-clamp-3">
                  {movie.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/movies/${movie._id || movie.id}`}
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Book Tickets
                  </Link>
                  <Link
                    to={`/movies/${movie._id || movie.id}`}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Watch Trailer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-red-600 w-6' : 'bg-white bg-opacity-50'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;
