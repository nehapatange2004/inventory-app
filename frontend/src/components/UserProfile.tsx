import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Order = {
  _id: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
  total: number;
};

export default function UserProfile() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch user orders
    fetch("/api/orders/my")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  const statusColors: Record<Order["status"], string> = {
    Pending: "bg-yellow-400",
    Processing: "bg-blue-400",
    Shipped: "bg-purple-400",
    Delivered: "bg-green-500",
    Cancelled: "bg-red-500",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order._id}
                className="flex justify-between items-center border border-gray-200 rounded-lg p-4 hover:shadow transition"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    Order #{order._id.slice(-6)}
                  </p>
                  <p className="text-gray-500 text-sm">{order.date}</p>
                  <p className="text-gray-700 text-sm">
                    Total: ₹{order.total}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${statusColors[order.status]}`}
                    title={order.status}
                  ></span>
                  <button
                    onClick={() => navigate(`/track/${order._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Track
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
