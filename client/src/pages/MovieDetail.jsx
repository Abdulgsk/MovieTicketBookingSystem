import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, Play } from 'lucide-react';
import { generateShowtimes } from '../utils/generateShowtimes';
import { movieService, theaterService } from '../utils/dataService';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [theaters, setTheaters] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTheaterId, setSelectedTheaterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getNextDays = (days) => {
    const result = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      result.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
      });
    }
    return result;
  };

  const nextDays = getNextDays(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setSelectedDate(nextDays[0].date);

        // Get movie data from our service
        const movieData = await movieService.getMovieById(id);
        if (!movieData) throw new Error('Movie not found');
        setMovie(movieData);

        // Get theaters data from our service
        const theatersData = await theaterService.getTheaters('Bengaluru');
        
        const theatersMap = {};
        theatersData.forEach(theater => {
          theatersMap[theater._id || theater.id] = theater;
        });
        setTheaters(theatersMap);

        const showtimeList = generateShowtimes([movieData], theatersData);
        setShowtimes(showtimeList);
        sessionStorage.setItem('showtimes', JSON.stringify(showtimeList));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  

  // Filter and group showtimes
  const filteredShowtimes = showtimes.filter(
    st => st.date === selectedDate &&
    (!selectedTheaterId || st.theaterId === selectedTheaterId)
  );

  // Group showtimes by theater
  const showtimesByTheater = {};
  filteredShowtimes.forEach(st => {
    if (!showtimesByTheater[st.theaterId]) {
      showtimesByTheater[st.theaterId] = [];
    }
    showtimesByTheater[st.theaterId].push(st);
  });

  // Get unique theater IDs for the filter dropdown
  const availableTheaters = Array.from(new Set(showtimes.map(st => st.theaterId)));
  
  // Log debug information
  useEffect(() => {
    console.log('Showtimes data:', {
      allShowtimes: showtimes,
      filteredShowtimes,
      showtimesByTheater,
      availableTheaters,
      selectedDate,
      selectedTheaterId,
      theaters
    });
  }, [showtimes, filteredShowtimes, selectedDate, selectedTheaterId]);

  const handleBookNow = (showtime) => {
    // Store the showtime details in session storage for the booking page
    sessionStorage.setItem('showtimes', JSON.stringify([showtime]));
    navigate(`/booking/${movie._id || movie.id}/${showtime.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-gray-900 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl text-white mb-4">Movie not found</h1>
          <Link to="/" className="text-red-500 hover:text-red-400">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10"></div>
          <img
            src={movie.backdropUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 flex flex-col justify-end h-full pb-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="w-40 md:w-48 rounded-lg shadow-lg -mt-24 md:-mt-32" 
            />
            <div className="flex-grow pt-4">
              <h1 className="text-3xl md:text-5xl font-bold text-white">{movie.title}</h1>
              <div className="flex items-center space-x-4 text-gray-300 mt-2">
                <div className="flex items-center"><Star size={16} className="mr-1 text-yellow-400" /><span>{movie.rating || 'N/A'}</span></div>
                <div className="flex items-center"><Clock size={16} className="mr-1" /><span>{movie.duration || 'N/A'}</span></div>
                <div className="flex items-center"><Calendar size={16} className="mr-1" /><span>{movie.releaseDate}</span></div>
              </div>
              <p className="max-w-2xl text-gray-300 mt-4">{movie.description || 'No description available'}</p>
              <div className="mt-6">
                <button className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                  <Play size={18} className="mr-2" />
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-6">Book Tickets</h2>
        
        {/* Date Selector */}
        <div className="mb-8">
          <h3 className="text-lg text-white mb-3">Select Date</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {nextDays.map((day) => (
              <button
                key={day.date}
                onClick={() => setSelectedDate(day.date)}
                className={`flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors ${
                  selectedDate === day.date
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-xs">{day.day}</span>
                <span className="font-medium">{day.dayNum}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theater Filter */}
        {availableTheaters.length > 0 && (
          <div className="mb-6">
            <label htmlFor="theater-filter" className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Theater:
            </label>
            <select
              id="theater-filter"
              value={selectedTheaterId || ''}
              onChange={(e) => setSelectedTheaterId(e.target.value || null)}
              className="bg-gray-800 text-white rounded-md px-3 py-2 w-full md:w-1/3"
            >
              <option value="">All Theaters</option>
              {availableTheaters.map((theaterId) => {
                const theater = theaters[theaterId];
                return theater ? (
                  <option key={theaterId} value={theaterId}>
                    {theater.name}
                  </option>
                ) : null;
              })}
            </select>
          </div>
        )}

        {/* Showtimes List */}
        {Object.keys(showtimesByTheater).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(showtimesByTheater).map(([theaterId, theaterShowtimes]) => {
              const theater = theaters[theaterId];
              if (!theater) return null;
              
              return (
                <div key={theaterId} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <h3 className="text-xl font-bold text-white">{theater.name}</h3>
                    <div className="flex items-center text-gray-400 mt-1 md:mt-0">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm">{theater.location || 'Location not specified'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {theaterShowtimes.map((showtime) => (
                      <button
                        key={showtime.id}
                        onClick={() => handleBookNow(showtime)}
                        className="px-4 py-2 bg-gray-700 hover:bg-red-600 text-white rounded-md transition-colors"
                      >
                        {showtime.time}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No showtimes available</h3>
            <p className="text-gray-400 mb-4">
              {selectedTheaterId
                ? 'Try selecting a different date or check other theaters.'
                : 'No showtimes found for the selected date. Please try another day.'}
            </p>
            {selectedTheaterId && (
              <button
                onClick={() => setSelectedTheaterId(null)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Show All Theaters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
