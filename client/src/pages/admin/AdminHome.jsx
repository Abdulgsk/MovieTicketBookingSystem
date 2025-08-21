import { useState, useEffect } from 'react';
import { Users, Ticket, Film, DollarSign, TrendingUp, Calendar } from 'lucide-react';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
    activeMovies: 0,
    activeUsers: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);
  useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`);
          const data = await res.json();
    
          setStats(data.stats);
          setRecentBookings(data.recentBookings);
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
        }
      };
    
      fetchDashboardData();
    }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex space-x-2">
          <select className="bg-gray-800 text-white py-2 px-4 rounded-md">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This year</option>
          </select>
          <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md">
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Bookings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-10 text-blue-500 mr-4">
              <Ticket size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Bookings</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalBookings.toLocaleString()}</h3>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-500 mr-1">↑ 12%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500 bg-opacity-10 text-green-500 mr-4">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-white">${stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-500 mr-1">↑ 8%</span>
            <span className="text-gray-400">vs last month</span>
          </div>
        </div>

        {/* Today's Bookings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500 bg-opacity-10 text-yellow-500 mr-4">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Today's Bookings</p>
              <h3 className="text-2xl font-bold text-white">{stats.todayBookings}</h3>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-red-500 mr-1">↓ 3%</span>
            <span className="text-gray-400">vs yesterday</span>
          </div>
        </div>

        {/* Active Movies */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500 bg-opacity-10 text-purple-500 mr-4">
              <Film size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Movies</p>
              <h3 className="text-2xl font-bold text-white">{stats.activeMovies}</h3>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-500 mr-1">↑ 2</span>
            <span className="text-gray-400">new releases this week</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-500 bg-opacity-10 text-red-500 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <h3 className="text-2xl font-bold text-white">{stats.activeUsers}</h3>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-500 mr-1">↑ 24</span>
            <span className="text-gray-400">new users today</span>
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-500 bg-opacity-10 text-indigo-500 mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Occupancy Rate</p>
              <h3 className="text-2xl font-bold text-white">76%</h3>
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-500 mr-1">↑ 5%</span>
            <span className="text-gray-400">vs last week</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <h2 className="text-xl font-bold text-white mb-4">Recent Bookings</h2>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Movie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Seats</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {recentBookings.map((booking, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.movieTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(booking.date).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{booking.seats}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${booking.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHome;
