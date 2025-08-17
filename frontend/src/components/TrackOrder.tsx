import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Circle, Clock, XCircle } from "lucide-react";

interface OrderType {
  _id: string;
  customer: string;
  products: {
    product: { name: string };
    quantity: number;
  }[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export default function TrackOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin");
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(response.data);
      } catch (err) {
        console.log("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (!orders.length) {
    return <p className="p-6 text-gray-600">No orders found!</p>;
  }

  const getStatusIcon = (status: OrderType["status"]) => {
    switch (status) {
      case "cancelled":
        return <XCircle className="text-red-500 w-6 h-6" />;
      case "pending":
        return <Clock className="text-orange-500 w-6 h-6" />;
      case "processing":
        return <Clock className="text-blue-500 w-6 h-6" />;
      case "shipped":
        return <CheckCircle className="text-blue-500 w-6 h-6" />;
      case "delivered":
        return <CheckCircle className="text-green-500 w-6 h-6" />;
      default:
        return <Circle className="text-gray-400 w-6 h-6" />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 border-b border-gray-300 pb-3">
        Order Tracking
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-5 hover:shadow-lg transition-shadow"
        >
          {/* Top: Order ID & Status */}
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold">{order._id}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`capitalize font-semibold ${
                  order.status === "cancelled"
                    ? "text-red-500"
                    : order.status === "delivered"
                    ? "text-green-600"
                    : order.status === "pending"
                    ? "text-orange-500"
                    : "text-blue-600"
                }`}
              >
                {order.status}
              </span>
              {getStatusIcon(order.status)}
            </div>
          </div>

          {/* Middle: Date & Total */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p className="text-left">
              <span className="font-medium text-gray-700">Date: </span>
              <span className="text-orange-600">
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </p>
            <p>
              <span className="font-medium text-gray-700">Total: </span>
              <span className="text-gray-900 font-semibold">
                ₹{order.totalAmount}
              </span>
            </p>
          </div>

          {/* Bottom: Items */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Items
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {order.products.map((item, index) => (
                <li key={index}>
                  <span className="font-medium text-gray-900">
                    {item.product?.name || "Unnamed Product"}
                  </span>{" "}
                  × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
