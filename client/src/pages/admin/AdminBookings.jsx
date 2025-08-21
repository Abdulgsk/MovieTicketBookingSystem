import { useState, useEffect } from 'react';
import { Search, Filter, Check, X, Eye } from 'lucide-react';
import axios from 'axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/bookings`);
        const formatted = response.data.map((b) => ({
          bid: b.bookingId,
          _id: b._id,
          movieTitle: b.movieTitle,
          theater: b.theater.name,
          customerName: b.userId?.name || 'Unknown',
          customerEmail: b.userId?.email || 'N/A',
          date: b.showtime.date,
          time: b.showtime.time,
          seats: b.selectedSeats.length,
          amount: b.totalAmount,
          status:  b.status
        }));
        setBookings(formatted);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    try {
      console.log("Booking id",selectedBookingId);
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/bookings/updateStatus/${selectedBookingId}`, {
        status: 'cancelled'
      });
  
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === selectedBookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
  
      setSelectedBookingId(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };
  const handleConfirmedBooking = async () => {
    try {
      console.log("Booking id",selectedBookingId);
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/bookings/updateStatus/${selectedBookingId}`, {
        status: 'completed'
      });
  
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === selectedBookingId ? { ...booking, status: 'completed' } : booking
        )
      );
  
      setSelectedBookingId(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };
  

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
    (booking.id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (booking.movieTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (booking.customerName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (booking.customerEmail?.toLowerCase() || '').includes(searchQuery.toLowerCase());
  
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900 text-green-200';
      case 'cancelled':
        return 'bg-red-900 text-red-200';
      case 'completed':
        return 'bg-blue-900 text-blue-200';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search by booking ID, movie, or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Movie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Seats
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {booking.bid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div>{booking.movieTitle}</div>
                        <div className="text-xs text-gray-400">{booking.theater}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div>{booking.customerName}</div>
                        <div className="text-xs text-gray-400">{booking.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div>
                        <div>{new Date(booking.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">{booking.time}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {booking.seats}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${booking.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedBookingId(booking._id)}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          <Eye size={18} />
                        </button>
                        {booking.status === 'confirmed' && (
                          <>
                            <button className="text-green-400 hover:text-green-300">
                              <Check size={18} />
                            </button>
                            <button className="text-red-400 hover:text-red-300">
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No bookings found</p>
            </div>
          )}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBookingId && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Booking Details</h3>
                <button
                  onClick={() => setSelectedBookingId(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Booking details content */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Booking ID</p>
                  <p className="text-white font-medium">
                    {filteredBookings.find(b => b._id === selectedBookingId)?.id}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Movie</p>
                    <p className="text-white">
                      {filteredBookings.find(b => b._id === selectedBookingId)?.movieTitle}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Theater</p>
                    <p className="text-white">
                      {filteredBookings.find(b => b._id === selectedBookingId)?.theater}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Date</p>
                    <p className="text-white">
                      {new Date(
                        filteredBookings.find(b => b._id === selectedBookingId)?.date || ''
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Time</p>
                    <p className="text-white">
                      {filteredBookings.find(b => b._id === selectedBookingId)?.time}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Seats</p>
                    <p className="text-white">
                      {filteredBookings.find(b => b._id === selectedBookingId)?.seats}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="text-white">
                      ${filteredBookings.find(b => b._id === selectedBookingId)?.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Customer</p>
                  <p className="text-white">
                    {filteredBookings.find(b => b._id === selectedBookingId)?.customerName}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {filteredBookings.find(b => b._id === selectedBookingId)?.customerEmail}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      filteredBookings.find(b => b._id === selectedBookingId)?.status || ''
                    )}`}
                  >
                    {(filteredBookings.find(b => b._id === selectedBookingId)?.status || '').charAt(0).toUpperCase() + 
                      (filteredBookings.find(b => b._id === selectedBookingId)?.status || '').slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                {filteredBookings.find(b => b._id === selectedBookingId)?.status === 'confirmed' && (
                  <>
                    <button onClick={handleCancelBooking} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors">
                      Cancel Booking
                    </button>
                    <button onClick={handleConfirmedBooking} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors">
                      Mark as Completed
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedBookingId(null)}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
