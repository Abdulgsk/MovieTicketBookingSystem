import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import SeatSelection from '../components/booking/SeatSelection';
import { movieService, theaterService } from '../utils/dataService';

const BookingPage = () => {
  const { id: movieId, showtime: showtimeId } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [theater, setTheater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [hasExistingReservation, setHasExistingReservation] = useState(false);
  const navigate = useNavigate();

  const ticketPrice = 12.99;

    useEffect(() => {
    // Load reserved seats from localStorage
    const storedReservations = JSON.parse(localStorage.getItem('reservedSeats')) || {};
    const now = new Date().getTime();

    // Filter out expired reservations
    const validReservations = {};
    let currentShowtimeReservations = [];
    Object.keys(storedReservations).forEach(seat => {
      if (storedReservations[seat].expiry > now) {
        validReservations[seat] = storedReservations[seat];
        if (storedReservations[seat].showtimeId === showtimeId) {
          currentShowtimeReservations.push(seat);
        }
      }
    });
    localStorage.setItem('reservedSeats', JSON.stringify(validReservations));
        setReservedSeats(currentShowtimeReservations);

    // Check if there's an existing reservation to allow returning to payment
    if (currentShowtimeReservations.length > 0) {
      setHasExistingReservation(true);
    }
  }, [showtimeId]);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        // Get movie data from our service
        const movieData = await movieService.getMovieById(movieId);
        if (!movieData) throw new Error('Movie not found');
        setMovie(movieData);

        // Get showtime from session storage
        const storedShowtimes = sessionStorage.getItem('showtimes');
        let selectedShowtime = null;
        
        if (storedShowtimes) {
          const parsedShowtimes = JSON.parse(storedShowtimes);
          selectedShowtime = parsedShowtimes.find(st => st.id === showtimeId);
          
          if (!selectedShowtime) {
            throw new Error('Showtime not found');
          }
          
          // Ensure we have the theater ID
          if (!selectedShowtime.theaterId) {
            throw new Error('Theater ID not found in showtime');
          }
          
          setShowtime(selectedShowtime);
          
          // Get theater data from our service
          const theaterData = await theaterService.getTheaterById(selectedShowtime.theaterId);
          if (!theaterData) throw new Error('Theater not found');
          setTheater(theaterData);
          
          // Generate seats for the theater
          const allSeats = [];
          for (let row = 0; row < 10; row++) {
            const rowLetter = String.fromCharCode(65 + row);
            for (let seat = 1; seat <= 10; seat++) {
              allSeats.push(`${rowLetter}${seat}`);
            }
          }

                    // Load booked seats from localStorage for the current showtime
          const allBookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || {};
          const showtimeBookedSeats = allBookedSeats[selectedShowtime.id] || [];


                    setBookedSeats(showtimeBookedSeats);

          // Also consider currently reserved seats for this showtime
          const currentReservations = JSON.parse(localStorage.getItem('reservedSeats')) || {};
          const showtimeReservedSeats = Object.keys(currentReservations).filter(
            (seat) => currentReservations[seat].showtimeId === selectedShowtime.id
          );

          // Filter out both booked and reserved seats from all possible seats
          const available = allSeats.filter(
            (seat) => !showtimeBookedSeats.includes(seat) && !showtimeReservedSeats.includes(seat)
          );
          setAvailableSeats(available);

          // Set reserved and selected seats for the UI
          setReservedSeats(showtimeReservedSeats);
          if (showtimeReservedSeats.length > 0) {
            setSelectedSeats(showtimeReservedSeats);
            setHasExistingReservation(true);
          }

        }
      } catch (err) {
        console.error('Error fetching booking data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [movieId, showtimeId]);

  const handleSeatSelect = (seat) => {
    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

      const handleProceedToPayment = () => {
    const seatsForPayment = selectedSeats.length > 0 ? selectedSeats : reservedSeats;
    if (seatsForPayment.length === 0) return;

    const now = new Date().getTime();
    const expiry = now + 5 * 60 * 1000; // 5 minutes from now
    const reservations = JSON.parse(localStorage.getItem('reservedSeats')) || {};

    seatsForPayment.forEach(seat => {
      reservations[seat] = { showtimeId, expiry };
    });

    localStorage.setItem('reservedSeats', JSON.stringify(reservations));
    setReservedSeats(prev => [...prev, ...selectedSeats]);


    const bookingId = `BK${Math.floor(Math.random() * 10000000)}`;

    navigate(`/payment/${bookingId}`, {
      state: {
        movie,
        showtime,
        theater,
        selectedSeats: seatsForPayment,
        totalAmount: seatsForPayment.length * ticketPrice,
        bookingId
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie || !showtime || !theater) {
    return (
      <div className="bg-gray-900 min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl text-white mb-4">Booking details not found</h1>
          <button 
            onClick={() => navigate(-1)}
            className="text-red-500 hover:text-red-400 flex items-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-1" />
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to movie
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Select Seats</h1>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-32 h-48 md:h-auto flex-shrink-0 mb-4 md:mb-0">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title} 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                <div className="md:ml-4 flex-grow">
                  <h2 className="text-xl font-bold text-white mb-2">{movie.title}</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start">
                      <Calendar size={16} className="mt-1 mr-2 text-gray-400" />
                      <div>
                        <p className="text-gray-300">Date</p>
                        <p className="text-white">
                          {new Date(showtime.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock size={16} className="mt-1 mr-2 text-gray-400" />
                      <div>
                        <p className="text-gray-300">Showtime</p>
                        <p className="text-white">{showtime.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin size={16} className="mt-1 mr-2 text-gray-400" />
                      <div>
                        <p className="text-gray-300">Theater</p>
                        <p className="text-white">{theater.name}</p>
                        <p className="text-gray-400 text-xs">{theater.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

                        <SeatSelection
              availableSeats={availableSeats}
              bookedSeats={bookedSeats}
              reservedSeats={reservedSeats}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Tickets ({selectedSeats.length})</span>
                  <span className="text-white">${(selectedSeats.length * ticketPrice).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Convenience Fee</span>
                  <span className="text-white">$1.99</span>
                </div>

                <div className="border-t border-gray-700 pt-4 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-white">${(selectedSeats.length * ticketPrice + 1.99).toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={selectedSeats.length === 0}
                className={`w-full flex items-center justify-center py-3 rounded-lg ${
                  selectedSeats.length === 0
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                } text-white font-semibold transition-colors`}
              >
                <Ticket size={18} className="mr-2" />
                Proceed to Payment
              </button>

              <p className="text-gray-500 text-xs mt-4 text-center">
                                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>

              {hasExistingReservation && (
                <button
                  onClick={handleProceedToPayment} // Re-use the same logic to navigate to payment
                  className="w-full flex items-center justify-center py-3 rounded-lg mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                >
                  Return to Payment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
