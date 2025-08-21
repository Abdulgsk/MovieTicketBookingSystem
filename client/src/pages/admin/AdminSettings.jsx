import { useState } from 'react';
import { Save } from 'lucide-react';

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'CineTicket',
    siteDescription: 'Your ultimate destination for booking movie tickets online',
    supportEmail: 'support@cineticket.com',
    supportPhone: '+91 1234567898',
    currency: 'INR',
    timezone: 'INDIA',
    bookingFee: '1.99',
    maxTicketsPerBooking: '15'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newBookingAlerts: true,
    bookingCancellationAlerts: true,
    lowSeatsAlerts: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleGeneralSettingChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationSettingChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className={`flex items-center ${
            isSaving ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
          } text-white py-2 px-4 rounded-md transition-colors`}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">General Settings</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-300 mb-1">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={generalSettings.siteName}
                onChange={handleGeneralSettingChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-300 mb-1">
                Site Description
              </label>
              <input
                type="text"
                id="siteDescription"
                name="siteDescription"
                value={generalSettings.siteDescription}
                onChange={handleGeneralSettingChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-300 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  id="supportEmail"
                  name="supportEmail"
                  value={generalSettings.supportEmail}
                  onChange={handleGeneralSettingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-300 mb-1">
                  Support Phone
                </label>
                <input
                  type="text"
                  id="supportPhone"
                  name="supportPhone"
                  value={generalSettings.supportPhone}
                  onChange={handleGeneralSettingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={generalSettings.currency}
                  onChange={handleGeneralSettingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>

              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-300 mb-1">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={generalSettings.timezone}
                  onChange={handleGeneralSettingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="America/New_York">India/Kolkata</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bookingFee" className="block text-sm font-medium text-gray-300 mb-1">
                  Booking Fee ($)
                </label>
                <input
                  type="text"
                  id="bookingFee"
                  name="bookingFee"
                  value={generalSettings.bookingFee}
                  onChange={handleGeneralSettingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="maxTicketsPerBooking" className="block text-sm font-medium text-gray-300 mb-1">
                  Max Tickets Per Booking
                </label>
                <input
                  type="text"
                  id="maxTicketsPerBooking"
                  name="maxTicketsPerBooking"
                  value={generalSettings.maxTicketsPerBooking}
                  onChange={handleGeneralSettingChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Notification Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-400">Send email notifications to users and admins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">SMS Notifications</h3>
                <p className="text-sm text-gray-400">Send SMS notifications to users and admins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="smsNotifications"
                  checked={notificationSettings.smsNotifications}
                  onChange={handleNotificationSettingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-white font-medium mb-3">Alert Types</h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="newBookingAlerts"
                    name="newBookingAlerts"
                    type="checkbox"
                    checked={notificationSettings.newBookingAlerts}
                    onChange={handleNotificationSettingChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="newBookingAlerts" className="ml-2 block text-sm text-gray-300">
                    New Booking Alerts
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="bookingCancellationAlerts"
                    name="bookingCancellationAlerts"
                    type="checkbox"
                    checked={notificationSettings.bookingCancellationAlerts}
                    onChange={handleNotificationSettingChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="bookingCancellationAlerts" className="ml-2 block text-sm text-gray-300">
                    Booking Cancellation Alerts
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="lowSeatsAlerts"
                    name="lowSeatsAlerts"
                    type="checkbox"
                    checked={notificationSettings.lowSeatsAlerts}
                    onChange={handleNotificationSettingChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="lowSeatsAlerts" className="ml-2 block text-sm text-gray-300">
                    Low Seats Availability Alerts
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Gateway Settings */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Payment Gateway</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-300 mb-1">
                Default Payment Gateway
              </label>
              <select
                id="paymentGateway"
                name="paymentGateway"
                className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="razorpay">Razorpay</option>
              </select>
            </div>

            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="text"
                id="apiKey"
                name="apiKey"
                className="w-full bg-gray-700 border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
