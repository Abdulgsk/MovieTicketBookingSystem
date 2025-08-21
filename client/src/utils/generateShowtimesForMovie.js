export const generateShowtimesForMovie = (movie, theaters) => {
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
  
    theaters.forEach(theater => {
      if (
        movie.availableCities.map(city => city.toLowerCase()).includes(theater.city.toLowerCase())
      ) {
        dates.forEach(date => {
          const shuffledTimes = [...times].sort(() => 0.5 - Math.random());
          for (let i = 0; i < 3; i++) {
            mockShowtimes.push({
              id: `st${id++}`,
              movieId: movie._id || movie.id, // Handle both _id and id formats
              theaterId: theater._id || theater.id, // Handle both _id and id formats
              date: date,
              time: shuffledTimes[i],
              theaterName: theater.name, // Add theater name for display
              movieTitle: movie.title // Add movie title for display
            });
          }
        });
      }
    });
  
    return mockShowtimes;
  };
  