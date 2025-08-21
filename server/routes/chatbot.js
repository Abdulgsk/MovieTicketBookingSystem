const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const Movie = require("../models/Movie"); 
const Theater = require("../models/Theater"); 

// Server-side mock data aligned to client/src/data/mockData.js
const mockMovies = [
  { title: 'Interstellar 2', rating: 9.2, duration: '2h 49min', language: 'English', genres: ['Sci-Fi', 'Adventure', 'Drama'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad'] },
  { title: 'The Last Stand', rating: 8.5, duration: '2h 15min', language: 'English', genres: ['Action', 'Thriller', 'Drama'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune'] },
  { title: 'Echoes of Time', rating: 8.8, duration: '2h 22min', language: 'English', genres: ['Drama', 'Sci-Fi', 'Mystery'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata'] },
  { title: 'Midnight Chronicles', rating: 7.9, duration: '2h 05min', language: 'English', genres: ['Fantasy', 'Crime', 'Horror'], availableCities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'] },
  { title: 'Beyond the Horizon', rating: 8.1, duration: '2h 35min', language: 'English', genres: ['Sci-Fi', 'Adventure', 'Documentary'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Pune'] },
  { title: 'The Final Heist', rating: 8.3, duration: '2h 12min', language: 'English', genres: ['Crime', 'Thriller', 'Action'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad'] },
  { title: 'Whispers in the Dark', rating: 7.6, duration: '1h 58min', language: 'English', genres: ['Horror', 'Thriller', 'Mystery'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune'] },
  { title: 'Lost in Translation 2', rating: 8.7, duration: '2h 08min', language: 'English, Japanese', genres: ['Drama', 'Romance', 'Comedy'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata'] },
  { title: 'Avatar: Frontiers of Pandora', rating: 9.0, duration: '2h 55min', language: 'English', genres: ['Sci-Fi', 'Adventure', 'Fantasy'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune'] },
  { title: 'The Grand Symphony', rating: 8.4, duration: '2h 18min', language: 'English', genres: ['Drama', 'Music', 'Biography'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata'] },
  { title: 'Quest for the Ancient City', rating: 7.8, duration: '2h 10min', language: 'English', genres: ['Adventure', 'Action', 'History'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune'] },
  { title: 'Laugh Factory', rating: 8.0, duration: '1h 52min', language: 'English', genres: ['Comedy', 'Drama'], availableCities: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad'] },
];

const mockTheaters = [
  { name: 'PVR Cinemas', location: 'Phoenix Mall, Viman Nagar', city: 'Mumbai', screens: 8 },
  { name: 'INOX Leisure', location: 'Garuda Mall, MG Road', city: 'Bengaluru', screens: 6 },
  { name: 'Cinepolis', location: 'Saket District Centre', city: 'Delhi', screens: 10 },
  { name: 'SPI Cinemas', location: 'Express Avenue Mall', city: 'Chennai', screens: 5 },
  { name: 'Carnival Cinemas', location: 'Banjara Hills', city: 'Hyderabad', screens: 7 },
  { name: 'INOX Multiplex', location: 'Salt Lake City', city: 'Kolkata', screens: 6 },
  { name: 'PVR Icon', location: 'Pavillion Mall, SB Road', city: 'Pune', screens: 9 },
  { name: 'Cinepolis VIP', location: 'Lower Parel', city: 'Mumbai', screens: 4 },
  { name: 'Movietime Cinemas', location: 'Andheri West', city: 'Mumbai', screens: 5 },
  { name: 'PVR Select Citywalk', location: 'Saket', city: 'Delhi', screens: 8 },
];

router.post("/", async (req, res) => {
  const { query } = req.body;

  try {
    const lowerQuery = query.toLowerCase();

    const allowedKeywords = [
      "movie", "movies",
      "ticket", "tickets",
      "theater", "theaters",
      "seat", "seats",
      "booking", "bookings",
      "payment", "showtime", "cancel", "refund", "offers", "discount"
    ];
    
    const wordsInQuery = lowerQuery.split(/\s+/); // 🔥 split the input by space
    
    const isRelated = wordsInQuery.some(word => allowedKeywords.includes(word));
    if (!isRelated) {
      return res.json({ reply: "Sorry, I can only assist with CineTicket movie bookings and information. 🎬" });
    }

    // Fetch movies and theaters from database, fallback to mocks
    let movies = [];
    let theaters = [];
    try {
      movies = await Movie.find().limit(50);
      theaters = await Theater.find().limit(50);
    } catch (dbErr) {
      console.warn('DB fetch failed, using mock data');
    }
    if (!movies || movies.length === 0) movies = mockMovies;
    if (!theaters || theaters.length === 0) theaters = mockTheaters;

    const movieTitles = movies.map(m => m.title.toLowerCase());
    const theaterNames = theaters.map(t => t.name.toLowerCase());

    // Find movie in query if exists
    const foundMovie = movieTitles.find(title => lowerQuery.includes(title));
    const foundTheater = theaterNames.find(name => lowerQuery.includes(name));

    if (lowerQuery.includes("how to use") || lowerQuery.includes("how do i use")) {
        const guide = `
        Here's how you can use this Movie Ticket Booking application:
  
        1️⃣ **Login/Register**: You need to first login or register using your email ID and password. After successful login, you will be able to view all available movies.  
        
        2️⃣ **Select a Movie**: Once you are logged in, browse through the list of movies and select the one you wish to watch. After selecting the movie, click on the **Book Tickets** button.  
        
        3️⃣ **Book Tickets**: In the booking page, you will see options to choose the date, showtime, and theater. After selecting these, proceed to the **Seat Selection** page.  
        
        4️⃣ **Seat Selection**: In this step, select the available seats. You can select a maximum of **10 seats**. Based on the number of seats selected, the total payment amount will be calculated.  
        
        5️⃣ **Payment**: After selecting your seats, proceed to the **Payment Page**. Here, you will need to enter your **card details** to complete the payment process.  
        
        6️⃣ **Booking Confirmation**: Once the payment is successful, you will see a **Booking Confirmation** page, and you can download your ticket.  
  
        🎬 I hope this guide helps you! Let me know if you need any more assistance.  
        `;
  
        return res.json({ reply: guide });
      }

    // 📍 1. What movies are showing?
    if (lowerQuery.includes("what movies") || lowerQuery.includes("movies now showing") || lowerQuery.includes("now playing") || lowerQuery.includes("available movies")) {
      const movieList = movies.map(movie => movie.title).join(", ");
      return res.json({ reply: `Currently playing movies are: ${movieList}.` });
    }

    // 📍 2. What theaters are available?
    if (lowerQuery.includes("available theaters") || lowerQuery.includes("theaters near me") || lowerQuery.includes("list theaters")) {
      const theaterList = theaters.map(theater => theater.name).join(", ");
      return res.json({ reply: `Our theaters are: ${theaterList}.` });
    }

    // 📍 3. Theaters showing a particular movie (by city match)
    if (foundMovie && (lowerQuery.includes("where can i watch") || lowerQuery.includes("which theaters") || lowerQuery.includes("showing at"))) {
      const movieObj = movies.find(m => m.title.toLowerCase() === foundMovie);
      const cities = (movieObj && movieObj.availableCities) ? movieObj.availableCities.map(c => c.toLowerCase()) : [];
      const theatersShowing = theaters.filter(t => t.city && cities.includes(t.city.toLowerCase()));
      if (theatersShowing.length > 0) {
        const list = theatersShowing.map(t => `${t.name} (${t.city})`).join(", ");
        return res.json({ reply: `You can watch "${movieObj.title}" at: ${list}.` });
      } else {
        return res.json({ reply: `Currently, "${movieObj ? movieObj.title : foundMovie}" has no matching theaters in your query.` });
      }
    }

    // 📍 4. Showtimes for a movie (mocked times)
    if (lowerQuery.includes("showtimes") || lowerQuery.includes("timings for") || lowerQuery.includes("what time")) {
      if (foundMovie) {
        const times = ['10:30 AM', '1:15 PM', '4:00 PM', '7:30 PM', '10:15 PM'];
        return res.json({ reply: `Showtimes for "${foundMovie}": ${times.join(', ')}` });
      }
    }

    // 📍 5. Ticket prices for a movie
    if (lowerQuery.includes("ticket price") || lowerQuery.includes("how much") || lowerQuery.includes("price for")) {
      if (foundMovie) {
        return res.json({ reply: `Ticket prices for "${foundMovie}" range between ₹200 to ₹500 depending on the theater and seating.` });
      }
    }

    // 📍 6. Movies at a particular theater (by city)
    if (foundTheater && (lowerQuery.includes("movies at") || lowerQuery.includes("what is playing at") || lowerQuery.includes("now showing at"))) {
      const theater = theaters.find(t => t.name.toLowerCase() === foundTheater);
      if (theater && theater.city) {
        const list = movies
          .filter(m => Array.isArray(m.availableCities) && m.availableCities.map(c => c.toLowerCase()).includes(theater.city.toLowerCase()))
          .map(m => m.title)
          .join(", ");
        return res.json({ reply: list ? `Movies playing at ${theater.name} (${theater.city}): ${list}` : `No movies found for ${theater.name} right now.` });
      }
    }

    // 📍 7. Static Question Handling
    if (lowerQuery.includes("cancel ticket")) {
      return res.json({ reply: "You can cancel your ticket up to 1 hour before showtime from 'My Bookings' section." });
    }

    if (lowerQuery.includes("refund policy")) {
      return res.json({ reply: "Refunds are processed within 5-7 business days after ticket cancellation." });
    }

    if (lowerQuery.includes("choose seat")) {
      return res.json({ reply: "Yes! You can select your preferred seats while booking the ticket." });
    }

    if (lowerQuery.includes("recliner seats")) {
      return res.json({ reply: "Recliner seats are available at select theaters like PVR Orion and Cinepolis." });
    }

    if (lowerQuery.includes("offers") || lowerQuery.includes("discounts")) {
      return res.json({ reply: "Currently, enjoy 20% cashback with XYZ Bank Cards on movie bookings!" });
    }

    if (lowerQuery.includes("wheelchair") || lowerQuery.includes("accessible")) {
      return res.json({ reply: "Yes, all our theaters are wheelchair accessible." });
    }

    if (lowerQuery.includes("subtitles")) {
      return res.json({ reply: "Subtitles are available for most English and regional movies." });
    }

    if (lowerQuery.includes("book ticket") || lowerQuery.includes("how to book")) {
      return res.json({ reply: "Select a movie → Choose a theater → Pick your seat → Complete payment. Done!" });
    }

    // 📍 8. Fallback to Gemini AI for anything else (grounded with mock data)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const context = `You are a helpful assistant for a Movie Ticket Booking App. Use this data when relevant.
Movies: ${movies.map(m => m.title).join(', ')}.
Theaters: ${theaters.map(t => `${t.name} (${t.city || 'N/A'})`).join(', ')}.`;
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: context }] },
        { role: "model", parts: [{ text: "Got it. I'll use the provided movies and theaters data to answer." }] },
      ],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
    });

    const result = await chat.sendMessage(query);
    const response = await result.response;
    const reply = response.text() || "Sorry, I didn't get that.";
    return res.json({ reply });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ reply: "Something went wrong!" });
  }
});

module.exports = router;
