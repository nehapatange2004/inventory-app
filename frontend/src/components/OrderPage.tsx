import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { auth } from "../wrapper/authWrapper";

interface Product {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  imgURL: string;
}

const OrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {setLoading} = auth();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/products/single/${id}`
        );
        setProduct(res.data);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found!</p>;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must sign in first!");
      navigate("/signin");
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/orders/make-order`,
        {
          items: [
            {
              productId: product._id,
              quantity: quantity,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = `${response.data.url}`;
      // toast.success("Order placed successfully!");
      // navigate("/user");
    } catch {
      toast.error("Checkout failed. Try again!");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link
        to="/"
        className="text-orange-600 font-medium mb-6 inline-block hover:underline"
      >
        &larr; Back to Inventory
      </Link>

      <motion.div
        layout
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row"
      >
        {/* Product Image */}
        <div className="md:w-1/2 bg-gray-100 p-6 flex items-center justify-center">
          <img
            src={`${import.meta.env.VITE_BACKEND_API}/api/products/preview/${
              product.imgURL
            }`}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-orange-600 mt-1 text-lg font-medium">
              {product.category}
            </p>
            <p className="text-xl font-semibold text-gray-800 mt-3">
              Price:{" "}
              <span className="text-orange-600 font-bold">
                ₹{product.price}
              </span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Expiry Date:{" "}
              <span className="font-medium">
                {new Date(product.expiryDate).toLocaleDateString()}
              </span>
            </p>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full text-xl hover:bg-gray-300"
              >
                −
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="bg-gray-200 w-9 h-9 flex items-center justify-center rounded-full text-xl hover:bg-gray-300"
              >
                +
              </button>
            </div>

            <p className="mt-6 text-2xl font-bold text-gray-900">
              Total:{" "}
              <span className="text-orange-600">
                ₹{product.price * quantity}
              </span>
            </p>
          </div>

          {/* Checkout Button */}
          <div className="mt-8 border-t pt-6">
            <button
              onClick={handleCheckout}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-orange-500 active:scale-95 transition-all"
            >
              Checkout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderPage;
