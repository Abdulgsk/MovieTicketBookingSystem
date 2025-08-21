import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Film, Search, User, LogOut, ChevronDown } from 'lucide-react';
import Button from '../common/Button';
import useAuth from '../../context/useAuth';
import axios from 'axios';
import Chatbot from '../chatbot/Chatbox';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setShowUserDropdown(false);
    navigate('/');
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies`);
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const results = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(results);
    } else {
      setFilteredMovies([]);
    }
  }, [searchQuery, movies]);

  const handleMovieClick = (movieId) => {
    setSearchQuery('');
    setFilteredMovies([]);
    navigate(`/movies/${movieId}`);
  };

  return (
    <>
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Film className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold">CineTicket</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Home</Link>
                <Link to="/movies" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Movies</Link>
                <Link to="/theaters" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">Theaters</Link>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            {/* <div className="relative mx-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search movies..."
                className="bg-gray-800 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gray-700"
              />
            </div> */}
            <div className="hidden md:flex items-center">
        <div className="relative mx-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-gray-800 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gray-700"
          />
          
          {/* Search Results Dropdown */}
          {filteredMovies.length > 0 && (
            <div className="absolute w-full bg-white text-black mt-1 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {filteredMovies.map((movie) => (
                <div
                  key={movie._id}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleMovieClick(movie._id)}
                >
                  {movie.title}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-1 text-sm text-white hover:text-red-500 transition-colors"
                >
                  <User size={18} />
                  <span>{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={16} />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-700"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-700 text-red-500"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="border-gray-600 text-white">Login</Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>Sign Up</Button>
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center">
            <button onClick={toggleMenu} className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800" onClick={toggleMenu}>Home</Link>
            <Link to="/movies" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800" onClick={toggleMenu}>Movies</Link>
            <Link to="/theaters" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800" onClick={toggleMenu}>Theaters</Link>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="px-4 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="w-full bg-gray-800 pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-gray-700"
                />
              </div>
            </div>

            <div className="mt-3 px-2 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-left text-white hover:bg-gray-700 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleLogout}
                    className="border-gray-600 text-white flex items-center justify-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" fullWidth onClick={() => { navigate('/login'); toggleMenu(); }} className="border-gray-600 text-white">Login</Button>
                  <Button variant="primary" fullWidth onClick={() => { navigate('/signup'); toggleMenu(); }}>Sign Up</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
    <Chatbot/>
    </>
  );
};

export default Navbar;


