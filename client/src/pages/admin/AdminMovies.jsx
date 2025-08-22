import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';
import axios from 'axios';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);


  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/movies`);
        setMovies(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Failed to fetch movies', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/admin/movies/delete/${id}`);
      setMovies(movies.filter((movie) => movie._id !== id));
    } catch (error) {
      console.error('Failed to delete movie', error);
      alert('Error deleting movie');
    }
  };
  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setShowEditModal(true);
  };
  

  const filteredMovies = searchQuery
    ? movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(movie.genres) &&
          movie.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : movies;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-white">Movies Management</h1>
        <button
          className="flex items-center bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
          onClick={() => setShowAddModal(true)}
        >
          <PlusCircle size={16} className="mr-2" />
          Add New Movie
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Movies Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Movie</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Genres</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Release Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredMovies.map((movie) => (
                  <tr key={movie._id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded object-cover"
                            src={movie.posterUrl || movie.backdropUrl}
                            alt={movie.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{movie.title}</div>
                          <div className="text-sm text-gray-400">{movie.language}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(movie.genres) ? (
                          movie.genres.map((genre, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 text-xs rounded bg-gray-700 text-gray-300"
                            >
                              {genre}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">No genres</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{movie.duration}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <span className="text-yellow-400">★</span> {movie.rating}/10
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          movie.comingSoon
                            ? 'bg-blue-900 text-blue-200'
                            : movie.isNewRelease
                            ? 'bg-green-900 text-green-200'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {movie.comingSoon ? 'Coming Soon' : movie.isNewRelease ? 'New Release' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">{movie.releaseDate}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-blue-400 hover:text-blue-300" onClick={() => handleEdit(movie)}>
                          <Edit size={18} />
                        </button>
                        <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(movie._id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No movies found</p>
            </div>
          )}
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl text-black">
            <h2 className="text-xl font-bold mb-4">Add New Movie</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const newMovie = {
                  title: form.title.value,
                  description: form.description.value,
                  posterUrl: form.posterUrl.value,
                  backdropUrl: form.backdropUrl.value,
                  rating: parseFloat(form.rating.value),
                  duration: form.duration.value,
                  language: form.language.value,
                  genres: form.genres.value.split(',').map(g => g.trim()),
                  releaseDate: form.releaseDate.value,
                  isNewRelease: form.isNewRelease.checked,
                  comingSoon: form.comingSoon.checked,
                  availableCities: form.availableCities.value.split(',').map(c => c.trim())
                };

                try {
                  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/movies/add`, newMovie);
                  setMovies(prev => [...prev, res.data]);
                  setShowAddModal(false);
                } catch (error) {
                  alert('Failed to add movie');
                  console.error(error);
                }
              }}
            >
              <input name="title" placeholder="Title" className="w-full mb-2 p-2 border rounded" required />
              <input name="description" placeholder="Description" className="w-full mb-2 p-2 border rounded" required />
              <input name="posterUrl" placeholder="Poster URL" className="w-full mb-2 p-2 border rounded" required />
              <input name="backdropUrl" placeholder="Backdrop URL" className="w-full mb-2 p-2 border rounded" required />
              <input name="rating" type="number" step="0.1" placeholder="Rating" className="w-full mb-2 p-2 border rounded" required />
              <input name="duration" placeholder="Duration" className="w-full mb-2 p-2 border rounded" required />
              <input name="language" placeholder="Language" className="w-full mb-2 p-2 border rounded" required />
              <input name="genres" placeholder="Genres (comma-separated)" className="w-full mb-2 p-2 border rounded" required />
              <input name="releaseDate" placeholder="Release Date" className="w-full mb-2 p-2 border rounded" required />
              <input name="availableCities" placeholder="Available Cities (comma-separated)" className="w-full mb-2 p-2 border rounded" required />
              <div className="flex gap-4 mb-4">
                <label>
                  <input type="checkbox" name="isNewRelease" className="mr-1" />
                  New Release
                </label>
                <label>
                  <input type="checkbox" name="comingSoon" className="mr-1" />
                  Coming Soon
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-600 hover:underline">Cancel</button>
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Add Movie</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {showEditModal && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl text-black">
            <h2 className="text-xl font-bold mb-4">Edit Movie</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const updatedMovie = {
                  title: form.title.value,
                  description: form.description.value,
                  posterUrl: form.posterUrl.value,
                  backdropUrl: form.backdropUrl.value,
                  rating: parseFloat(form.rating.value),
                  duration: form.duration.value,
                  language: form.language.value,
                  genres: form.genres.value.split(',').map(g => g.trim()),
                  releaseDate: form.releaseDate.value,
                  isNewRelease: form.isNewRelease.checked,
                  comingSoon: form.comingSoon.checked,
                  availableCities: form.availableCities.value.split(',').map(c => c.trim())
                };

                try {
                  await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/admin/movies/update/${selectedMovie._id}`, updatedMovie);
                  setMovies(movies.map(m => m._id === selectedMovie._id ? { ...updatedMovie, _id: selectedMovie._id } : m));
                  setShowEditModal(false);
                  setSelectedMovie(null);
                } catch (error) {
                  alert('Failed to update movie');
                  console.error(error);
                }
              }}
            >
              <input name="title" defaultValue={selectedMovie.title} className="w-full mb-2 p-2 border rounded" required />
              <input name="description" defaultValue={selectedMovie.description} className="w-full mb-2 p-2 border rounded" required />
              <input name="posterUrl" defaultValue={selectedMovie.posterUrl} className="w-full mb-2 p-2 border rounded" required />
              <input name="backdropUrl" defaultValue={selectedMovie.backdropUrl} className="w-full mb-2 p-2 border rounded" required />
              <input name="rating" type="number" step="0.1" defaultValue={selectedMovie.rating} className="w-full mb-2 p-2 border rounded" required />
              <input name="duration" defaultValue={selectedMovie.duration} className="w-full mb-2 p-2 border rounded" required />
              <input name="language" defaultValue={selectedMovie.language} className="w-full mb-2 p-2 border rounded" required />
              <input name="genres" defaultValue={selectedMovie.genres?.join(', ')} className="w-full mb-2 p-2 border rounded" required />
              <input name="releaseDate" defaultValue={selectedMovie.releaseDate} className="w-full mb-2 p-2 border rounded" required />
              <input name="availableCities" defaultValue={selectedMovie.availableCities?.join(', ')} className="w-full mb-2 p-2 border rounded" required />
              <div className="flex gap-4 mb-4">
                <label>
                  <input type="checkbox" name="isNewRelease" className="mr-1" defaultChecked={selectedMovie.isNewRelease} />
                  New Release
                </label>
                <label>
                  <input type="checkbox" name="comingSoon" className="mr-1" defaultChecked={selectedMovie.comingSoon} />
                  Coming Soon
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setShowEditModal(false); setSelectedMovie(null); }} className="text-gray-600 hover:underline">Cancel</button>
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminMovies;
