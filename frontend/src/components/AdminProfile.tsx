import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AddProductForm from "./AddProductForm";
import { Outlet, useNavigate } from "react-router";

interface Product {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  imgURL: string;
}

interface Order {
  _id: string;
  customer: string;
  products: { product: Product; quantity: number }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"add" | "products" | "orders">("add");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  >("all");

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const token = localStorage.getItem("token"); // admin token

  // Fetch products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === "products") fetchProducts();
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  // Update order status
  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      setOrders(prevOrders =>
    prevOrders.map(order =>
      order._id === orderId? { ...order, status: status } : order
    )
  );
      await axios.put(
        `${import.meta.env.VITE_BACKEND_API}/api/orders/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove from UI
      setProducts((prev) => prev.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-orange-600 mb-6">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex gap-4 pb-6 justify-center border-b border-b-zinc-500/50">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "add" ? "bg-orange-600 text-white" : "bg-gray-200"
          }`}
        >
          Add Product
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "products" ? "bg-orange-600 text-white" : "bg-gray-200"
          }`}
        >
          Manage Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "orders" ? "bg-orange-600 text-white" : "bg-gray-200"
          }`}
        >
          Manage Orders
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "add" && <AddProductForm />}

        {activeTab === "products" && (
          <div>
            {loadingProducts ? (
              <p className="text-center mt-10 text-gray-500">Loading products...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_API}/api/products/preview/${product.imgURL}`}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="p-4 flex flex-col flex-1">
                      <h2 className="text-2xl font-bold text-orange-600 truncate">
                        {product.name}
                      </h2>

                      <div className="mt-2 flex flex-col gap-1 text-gray-700">
                        <p className="text-sm">
                          <span className="font-semibold">Category:</span>{" "}
                          <span className="capitalize">{product.category}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Quantity:</span> {product.quantity}
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">Price:</span> ${product.price}
                        </p>
                      </div>

                      {/* Expiry & Edit/Delete Buttons */}
                      <div className="mt-auto flex items-center justify-between pt-4 gap-2">
                        <span className="text-xs text-gray-500">
                          Expires: {new Date(product.expiryDate).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                          type="button"
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-500 transition-colors"
                            onClick={() => navigate(`/admin/edit/${product._id}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-500 transition-colors"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            {/* Filter Dropdown */}
            <div className="flex justify-start mb-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="border p-2 rounded mt-2"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {loadingOrders ? (
              <p className="text-center mt-10 text-gray-500">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-center mt-10 text-gray-500">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders
                  .filter((order) => filterStatus === "all" || order.status === filterStatus)
                  .map((order) => (
                    <motion.div
                      key={order._id}
                      layout
                      className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div>
                        <p>
                          <span className="font-semibold">Order ID:</span> {order._id}
                        </p>
                        <p>
                          <span className="font-semibold">Customer:</span> {order.customer}
                        </p>
                        <p>
                          <span className="font-semibold">Total Amount:</span> ${order.totalAmount}
                        </p>
                        <p>
                          <span className="font-semibold">Products:</span>{" "}
                          {order.products
                            .map((p) => `${p.product.name} x${p.quantity}`)
                            .join(", ")}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="border p-1 rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default AdminProfile;
