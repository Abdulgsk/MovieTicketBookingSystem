import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PaymentPage from './pages/PaymentPage';
import AuthProvider from './context/AuthProvider';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute'
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Register';
import MovieDetail from './pages/MovieDetail';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import AdminRoute from './components/auth/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import MoviesPage from './pages/MoviesPage';
import TheaterPage from './pages/TheaterPage';
// import Admin from './pages/Admin';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/theaters" element={<TheaterPage />} />
              <Route path="/movies/:id" element={<MovieDetail />} />
              <Route path="/booking/:id/:showtime" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />              
              <Route path="/payment/:bookingId" element={<PaymentPage />} />
              <Route path="/confirmation/:bookingId" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
              <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              {/*
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/admin" element={<Admin />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  );
};

export default App;
