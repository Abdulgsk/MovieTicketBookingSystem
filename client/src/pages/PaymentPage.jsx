import {  useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51RBJYsFwJt3goCLz4tzyqGUKRYt3hfaXjFWuSPKhbZ014goqCnqyFlSKJvPnpynQX15gTEJUiGLLoNEEWc2kvRHU00W5Zfee1l');

const CheckoutForm = ({ bookingId, bookingData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);
    const amountInPaise = Math.round(bookingData?.totalAmount * 100);
    if (!amountInPaise) {
        setError('Invalid amount');
        setIsProcessing(false);
        return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInPaise*100 }) // amount in paise
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error.message);
        setIsProcessing(false);
        return;
      }

      const { clientSecret } = data;

      if (!clientSecret) {
        setError('Failed to get client secret from server.');
        setIsProcessing(false);
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'Test User'
          }
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
                const { selectedSeats, showtime } = bookingData;

        // Update reserved seats: remove the seats that are now booked
        const reservations = JSON.parse(localStorage.getItem('reservedSeats')) || {};
        selectedSeats.forEach(seat => {
          delete reservations[seat];
        });
        localStorage.setItem('reservedSeats', JSON.stringify(reservations));

        // Update booked seats: add the newly booked seats
        const allBookedSeats = JSON.parse(localStorage.getItem('bookedSeats')) || {};
        const showtimeBookedSeats = allBookedSeats[showtime.id] || [];
        const newBookedSeats = [...new Set([...showtimeBookedSeats, ...selectedSeats])];
        allBookedSeats[showtime.id] = newBookedSeats;
        localStorage.setItem('bookedSeats', JSON.stringify(allBookedSeats));

        navigate(`/confirmation/${bookingId}`, { state: { ...bookingData } });
      }
    } catch (err) {
      console.error(err);
      setError('Payment failed. Try again.');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handlePayment} className="bg-gray-800 rounded-lg p-6 space-y-6">
      <h2 className="text-lg font-semibold text-white">Stripe Payment</h2>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#fff',
              '::placeholder': { color: '#ccc' },
            },
            invalid: { color: '#fa755a' }
          }
        }}
        className="bg-gray-700 p-4 rounded-md text-white"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-3 text-lg font-semibold text-white bg-red-500 rounded-lg ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};

  if (!bookingData.movie) {
    navigate('/');
    return null;
  }

  const { movie, showtime, theater, selectedSeats, totalAmount } = bookingData;

  return (
    <Elements stripe={stripePromise}>
      <div className="bg-gray-900 min-h-screen pb-16">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-6"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to seat selection
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Stripe Payment */}
            <div className="lg:col-span-2">
              <CheckoutForm bookingId={bookingId} bookingData={bookingData}  />
            </div>

            {/* Right: Booking Summary (Unchanged) */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-white mb-4">Booking Summary</h2>
              <div className="text-sm text-gray-400">
                <p><strong>Movie:</strong> {movie?.title}</p>
                <p><strong>Showtime:</strong> {showtime.date} at {showtime.time}</p>
                <p><strong>Theater:</strong> {theater.name}</p>
                <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                <p><strong>Total:</strong> ₹{totalAmount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default PaymentPage;
