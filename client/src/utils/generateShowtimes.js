export const generateShowtimes = (movies, theaters) => {
  const mockShowtimes = [];

  const getNextDays = (days) => {
    const result = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      result.push(date.toISOString().split('T')[0]);
    }
    return result;
  };

  const dates = getNextDays(7);
  const times = ['10:00 AM', '12:30 PM', '3:00 PM', '6:30 PM', '9:30 PM'];
  let id = 1;

  console.log('Generating showtimes for movies:', movies);
  console.log('Available theaters:', theaters);
  
  movies.forEach(movie => {
    const movieId = movie._id || movie.id;
    if (!movieId) {
      console.warn('Movie is missing both _id and id:', movie);
      return;
    }

    console.log(`\nProcessing movie: ${movie.title} (ID: ${movieId})`);
    console.log('Available cities:', movie.availableCities);

    theaters.forEach(theater => {
      const theaterId = theater._id || theater.id;
      if (!theaterId) {
        console.warn('Theater is missing both _id and id:', theater);
        return;
      }

      // Normalize city names for comparison
      const movieCities = Array.isArray(movie.availableCities) 
        ? movie.availableCities.map(city => 
            typeof city === 'string' ? city.trim().toLowerCase() : ''
          ).filter(Boolean)
        : [];
      
      const theaterCity = typeof theater.city === 'string' 
        ? theater.city.trim().toLowerCase() 
        : '';
      
      console.log(`\nChecking theater: ${theater.name} (${theaterCity})`);
      console.log(`Movie available in cities:`, movieCities);
      
      const isCityMatch = movieCities.some(city => 
        city.includes(theaterCity) || theaterCity.includes(city)
      );
      
      if (isCityMatch) {
        console.log(`✅ Match found for ${movie.title} in ${theater.name}`);
        dates.forEach(date => {
          const shuffledTimes = [...times].sort(() => 0.5 - Math.random());
          const showtimesToAdd = Math.min(3, shuffledTimes.length);
          
          for (let i = 0; i < showtimesToAdd; i++) {
            mockShowtimes.push({
              id: `st${id++}`,
              movieId: movieId,
              movieTitle: movie.title,
              theaterId: theaterId,
              theaterName: theater.name,
              date: date,
              time: shuffledTimes[i],
              price: 250 + Math.floor(Math.random() * 200) // Random price between 250-450
            });
          }
        });
      }
    });
  });

  return mockShowtimes;
};
