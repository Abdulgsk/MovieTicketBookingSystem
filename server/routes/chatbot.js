const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const Movie = require("../models/Movie"); 
const Theater = require("../models/Theater"); 

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

    // Fetch movies and theaters from database
    const movies = await Movie.find();
    const theaters = await Theater.find();

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
      const movieList = movies.map(movie => movie.title).join(", 👈");
      return res.json({ reply: `Currently playing movies are: ${movieList}.` });
    }

    // 📍 2. What theaters are available?
    if (lowerQuery.includes("available theaters") || lowerQuery.includes("theaters near me") || lowerQuery.includes("list theaters")) {
      const theaterList = theaters.map(theater => theater.name).join(", ");
      return res.json({ reply: `Our theaters are: ${theaterList}.` });
    }

    // 📍 3. Theaters showing a particular movie
    if (lowerQuery.includes(" ") || lowerQuery.includes("where can i watch") || lowerQuery.includes("which theaters")) {
      if (foundMovie) {
        const theatersShowingMovie = theaters.filter(theater =>
          theater.moviesShowing.map(m => m.toLowerCase()).includes(foundMovie)
        );
        if (theatersShowingMovie.length > 0) {
          const list = theatersShowingMovie.map(t => t.name).join(", ");
          return res.json({ reply: `You can watch "${foundMovie}" at: ${list}.` });
        } else {
          return res.json({ reply: `Currently, "${foundMovie}" is not available in any theater.` });
        }
      }
    }

    // 📍 4. Showtimes for a movie
    if (lowerQuery.includes("showtimes") || lowerQuery.includes("timings for")) {
      if (foundMovie) {
        const showtimeInfo = movies.find(m => m.title.toLowerCase() === foundMovie);
        if (showtimeInfo && showtimeInfo.showtimes.length > 0) {
          const timings = showtimeInfo.showtimes.map(s => `${s.theater}: ${s.time}`).join("; ");
          return res.json({ reply: `Showtimes for "${showtimeInfo.title}": ${timings}` });
        } else {
          return res.json({ reply: `No showtimes available for "${foundMovie}".` });
        }
      }
    }

    // 📍 5. Ticket prices for a movie
    if (lowerQuery.includes("ticket price") || lowerQuery.includes("how much") || lowerQuery.includes("price for")) {
      if (foundMovie) {
        return res.json({ reply: `Ticket prices for "${foundMovie}" range between ₹200 to ₹500 depending on the theater and seating.` });
      }
    }

    // 📍 6. Movies at a particular theater
    if (foundTheater && lowerQuery.includes("movies at")) {
      const theater = theaters.find(t => t.name.toLowerCase() === foundTheater);
      if (theater) {
        const movieList = theater.moviesShowing.join(", ");
        return res.json({ reply: `Movies playing at ${theater.name} are: ${movieList}` });
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

    // 📍 8. Fallback to Gemini AI for anything else
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a helpful assistant for a Movie Ticket Booking App." }],
        },
        {
          role: "model",
          parts: [{ text: "Understood! I'm here to help with all your movie ticket booking needs. How can I assist you today?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(query);
    const response = await result.response;
    const reply = response.text() || "Sorry, I didn't get that.";

    console.log("Gemini Response:", reply);

    res.json({ reply });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ reply: "Something went wrong!" });
  }
});

module.exports = router;
