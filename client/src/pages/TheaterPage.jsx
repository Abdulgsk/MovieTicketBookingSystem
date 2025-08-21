import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { theaterService } from '../utils/dataService';

const TheaterPage = () => {
  const [theaters, setTheaters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const theaterData = await theaterService.getTheaters();
        setTheaters(theaterData);
      } catch (error) {
        console.error('Error fetching theaters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <MapPin className="h-5 w-5 text-amber-500 mr-2" />
            Theaters
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {theaters.map((theater) => (
            <div key={theater._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{theater.name}</h3>
              <p className="text-gray-600 mb-1">{theater.location}</p>
              <p className="text-gray-600 mb-1">{theater.city}</p>
              <p className="text-gray-600 text-sm">Screens: {theater.screens}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheaterPage;
