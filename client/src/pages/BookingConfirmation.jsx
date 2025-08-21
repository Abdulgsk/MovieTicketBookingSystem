import { useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Check, Calendar, Clock, MapPin, Ticket, Download, Share2 } from 'lucide-react';
import QRCode from '../components/booking/QRCode';
import axios from "axios";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};
  const { movie, showtime, theater, selectedSeats, totalAmount } = bookingData;
  const user = JSON.parse(localStorage.getItem("user"));
  const hasBookedRef = useRef(false);
  
  useEffect(() => {
    if (!movie || !user || !bookingId) {
      console.log("Missing required booking data");
      return;
    }
    
    const bookingIdentifier = `${bookingId}-${user.id}`;
    
    const savedBookings = localStorage.getItem("savedBookings") || "{}";
    const savedBookingsObj = JSON.parse(savedBookings);
    
    if (savedBookingsObj[bookingIdentifier]) {
      console.log("Booking already saved previously");
      return;
    }
    
    if (hasBookedRef.current) {
      console.log("Booking already being processed");
      return;
    }
    
    const saveBooking = async () => {
      hasBookedRef.current = true;
      
      try {
        
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/bookings/create`, {
          bookingId,
          paymentId: bookingId,
          userId: user.id,
          movieTitle: movie.title,
          showtime,
          theater,
          selectedSeats,
          totalAmount
        });
        savedBookingsObj[bookingIdentifier] = true;
        localStorage.setItem("savedBookings", JSON.stringify(savedBookingsObj));
        
      } catch (err) {
        console.error("Booking failed:", err);
        hasBookedRef.current = false;
      }
    };
    
    saveBooking();
    
  }, [bookingId, user]);
  
  if (!bookingData.movie) {
    navigate('/');
    return null;
  }

  return (
    <div className="bg-gray-900 min-h-screen pb-16 relative overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4">
            <Check size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Your tickets have been booked successfully. We've sent a confirmation to your email.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="relative h-40 bg-gradient-to-r from-gray-900 to-gray-700 flex items-center px-6">
            <div className="absolute inset-0 opacity-30">
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 flex items-center">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-24 h-32 object-cover rounded-md shadow-lg mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{movie.title}</h2>
                <p className="text-gray-300 mb-2">
                  {movie.duration} • {movie.language}
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.slice(0, 2).map((genre, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Date</p>
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-500 mr-2" />
                  <p className="text-white">
                    {new Date(showtime.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Time</p>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-500 mr-2" />
                  <p className="text-white">{showtime.time}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Seats</p>
                <div className="flex items-center">
                  <Ticket size={16} className="text-gray-500 mr-2" />
                  <p className="text-white">{selectedSeats.sort().join(', ')}</p>
                </div>
              </div>

              <div className="col-span-2 md:col-span-3">
                <p className="text-gray-400 text-sm mb-1">Theater</p>
                <div className="flex items-center">
                  <MapPin size={16} className="text-gray-500 mr-2" />
                  <div>
                    <p className="text-white">{theater.name}</p>
                    <p className="text-gray-400 text-sm">{theater.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col md:flex-row items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Booking ID</p>
              <p className="text-white font-mono text-lg">{bookingId}</p>
              <p className="text-gray-400 text-sm mt-2">Amount Paid</p>
              <p className="text-white font-bold">${totalAmount.toFixed(2)}</p>
            </div>

            <div className="mt-4 md:mt-0 bg-white p-3 rounded-lg">
              <QRCode />
              <p className="text-xs text-center text-gray-800 mt-1">Scan at theater</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="flex items-center bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition-colors">
            <Download size={18} className="mr-2" />
            Download Ticket
          </button>

          <button className="flex items-center bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-lg transition-colors">
            <Share2 size={18} className="mr-2" />
            Share
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Important Information</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>• Please arrive at least 15 minutes before the showtime.</li>
            <li>• Show your QR code at the entrance for verification.</li>
            <li>• Outside food and beverages are not allowed in the theater.</li>
            <li>• Ticket prices cannot be refunded or exchanged once purchased.</li>
          </ul>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;