import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

const SeatSelection = ({
  availableSeats,
  bookedSeats,
  reservedSeats = [], // Add reservedSeats prop
  selectedSeats,
  onSeatSelect,
  maxSelectable = 10
}) => {
  const [showLegend, setShowLegend] = useState(false);
  const [seatMap, setSeatMap] = useState([]);

  useEffect(() => {
    const rows = new Set();
    availableSeats.forEach(seat => {
      rows.add(seat.charAt(0));
    });

    const rowsArray = Array.from(rows).sort();
    const seatsByRow = {};

    rowsArray.forEach(row => {
      seatsByRow[row] = availableSeats
        .filter(seat => seat.startsWith(row))
        .sort((a, b) => {
          const numA = parseInt(a.substring(1));
          const numB = parseInt(b.substring(1));
          return numA - numB;
        });
    });

    const map = rowsArray.map(row => seatsByRow[row]);
    setSeatMap(map);
  }, [availableSeats]);

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat) || reservedSeats.includes(seat)) {
      return; // Seat is already booked or reserved
    }

    if (selectedSeats.includes(seat)) {
      onSeatSelect(seat); // Deselect
    } else if (selectedSeats.length < maxSelectable) {
      onSeatSelect(seat); // Select
    }
  };

  const getSeatStatus = (seat) => {
    if (bookedSeats.includes(seat)) return 'booked';
    if (reservedSeats.includes(seat)) return 'reserved';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Select Seats</h3>
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="flex items-center text-gray-300 hover:text-white"
        >
          <Info size={16} className="mr-1" />
          Legend
        </button>
      </div>

      {showLegend && (
        <div className="bg-gray-800 p-4 rounded-md mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-md bg-gray-700 mr-2"></div>
              <span className="text-sm text-gray-300">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-md bg-red-600 mr-2"></div>
              <span className="text-sm text-gray-300">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-md bg-gray-500 mr-2"></div>
              <span className="text-sm text-gray-300">Booked</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-md bg-yellow-500 mr-2"></div>
              <span className="text-sm text-gray-300">Reserved</span>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        {/* Screen */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-3/4 h-2 bg-gray-600 rounded-lg mb-1"></div>
          <div className="w-4/5 h-8 bg-gradient-to-b from-gray-500 to-gray-700 rounded opacity-30 mb-1"></div>
          <p className="text-gray-400 text-sm">SCREEN</p>
        </div>

        <div className="flex flex-col items-center space-y-2 min-w-max">
          {seatMap.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center">
              <div className="w-6 text-gray-400 text-sm font-medium mr-2">
                {String.fromCharCode(65 + rowIndex)}
              </div>
              <div className="flex space-x-2">
                {row.map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <button
                      key={seat}
                      onClick={() => handleSeatClick(seat)}
                      disabled={status === 'booked' || status === 'reserved'}
                      className={`w-8 h-8 rounded-t-md flex items-center justify-center text-xs font-medium transition-colors ${
                        status === 'booked'
                          ? 'bg-gray-500 cursor-not-allowed'
                          : status === 'reserved'
                          ? 'bg-yellow-500 cursor-not-allowed'
                          : status === 'selected'
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-white'
                      }`}
                    >
                      {seat.substring(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-800 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white">Selected Seats: {selectedSeats.length}</p>
            <p className="text-gray-400 text-sm">
              {selectedSeats.length > 0
                ? selectedSeats.sort().join(', ')
                : 'No seats selected'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-white">Available: {maxSelectable - selectedSeats.length}</p>
            <p className="text-gray-400 text-sm">Max {maxSelectable} seats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
