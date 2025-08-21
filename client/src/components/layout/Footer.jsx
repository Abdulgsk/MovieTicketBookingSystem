import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center mb-4">
              <Film className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-white">CineTicket</span>
            </Link>
            <p className="text-sm mb-4">
              Book movie tickets quickly and easily for all the latest releases.
              Experience cinema at its best with CineTicket.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/movies" className="text-gray-400 hover:text-white">Movies</Link></li>
              <li><Link to="/theaters" className="text-gray-400 hover:text-white">Theaters</Link></li>
              <li><Link to="/offers" className="text-gray-400 hover:text-white">Offers</Link></li>
              <li><Link to="/gift-cards" className="text-gray-400 hover:text-white">Gift Cards</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQs</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-gray-400 hover:text-white">Refund Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Download App</h3>
            <p className="text-sm mb-4">Get the best experience with our mobile app</p>
            <div className="space-y-2">
              <a href="#" className="inline-block">
                <img 
                  src="https://images.pexels.com/photos/218717/pexels-photo-218717.jpeg" 
                  alt="Download on App Store" 
                  className="h-10 w-32 object-contain rounded" 
                />
              </a>
              <a href="#" className="inline-block">
                <img 
                  src="https://images.pexels.com/photos/218717/pexels-photo-218717.jpeg" 
                  alt="Get it on Google Play" 
                  className="h-10 w-32 object-contain rounded" 
                />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} CineTicket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
