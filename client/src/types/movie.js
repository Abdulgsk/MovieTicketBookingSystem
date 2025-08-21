/**
 * @typedef {Object} Movie
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} posterUrl
 * @property {string} [backdropUrl]
 * @property {number} rating
 * @property {string} duration
 * @property {string} language
 * @property {string[]} genres
 * @property {string} releaseDate
 * @property {boolean} isNewRelease
 * @property {boolean} comingSoon
 * @property {string[]} availableCities
 */

/**
 * @typedef {Object} Theater
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} city
 * @property {number} screens
 */

/**
 * @typedef {Object} Showtime
 * @property {string} id
 * @property {string} movieId
 * @property {string} theaterId
 * @property {string} date
 * @property {string} time
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} userId
 * @property {string} movieId
 * @property {string} theaterId
 * @property {string} showtimeId
 * @property {string[]} seats
 * @property {number} amount
 * @property {string} date
 * @property {'confirmed' | 'cancelled' | 'completed'} status
 */
