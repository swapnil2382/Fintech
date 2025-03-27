import { useState, useEffect } from "react";
import axios from "axios";
import { FaBell, FaCheckCircle } from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNotifications(data);
      setError(null);
    } catch (error) {
      setError(
        "Failed to fetch notifications: " +
          (error.response?.data?.error || error.message)
      );
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNotifications(
        notifications.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError(
        "Failed to mark notification as read: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Notifications</h2>
      {loading && <p className="text-gray-600 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {notifications.length === 0 && !loading ? (
        <p className="text-gray-600 text-center">
          No notifications to display.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-4 rounded-lg shadow-md flex justify-between items-center ${
                notif.read ? "bg-gray-200" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <FaBell
                  className={`text-2xl ${
                    notif.type === "anomaly"
                      ? "text-red-500"
                      : notif.type === "behavior"
                      ? "text-yellow-500"
                      : "text-orange-500" // For budget_exceed
                  }`}
                />
                <div>
                  <p className="text-gray-800">
                    {notif.type === "budget_exceed" && notif.category
                      ? `${notif.category}: ${notif.message}`
                      : notif.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(notif.date).toLocaleString()}
                  </p>
                </div>
              </div>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif._id)}
                  className="text-green-500 hover:text-green-700 transition duration-200"
                  title="Mark as read"
                >
                  <FaCheckCircle />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
