import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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

const SingleProductView = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { isUserLoggedIn, user } = auth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/products/single/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found!</p>;

  // const imageUrl = `${import.meta.env.VITE_BACKEND_API}/api/products/image/${product.imgU}`;

  const handleBuyOrRedirect = () => {
    if (!isUserLoggedIn) {
      navigate("/signin");
    } else {
      // handleBuy();
      navigate(`/order/${id}`)
    }
  };

  
  const handleEdit = () => {
    toast.success("Edit product functionality triggered");
    // Optionally navigate to edit page or open a modal
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-orange-600 font-medium mb-4 inline-block">
        &larr; Back to Inventory
      </Link>
      <motion.div
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6"
      >
        <img
          // src={imageUrl}
          src= {`${import.meta.env.VITE_BACKEND_API}/api/products/preview/${product.imgURL}`}
          alt={product.name}
          className="w-full md:w-64 h-64 object-cover rounded-xl"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-orange-600">{product.name}</h2>
            <p className="text-gray-600 mt-2 capitalize">Category: {product.category}</p>
            <p className="text-gray-600 mt-1">Quantity: {product.quantity}</p>
            <p className="text-gray-600 mt-1">Price: ${product.price}</p>
            <p className="text-gray-600 mt-1">
              Expiry Date: {new Date(product.expiryDate).toLocaleDateString()}
            </p>
          </div>

          {/* Role-based button */}
          {user?.role === "admin" ? (
            <button
              onClick={handleEdit}
              className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition-colors duration-200"
            >
              Edit Product
            </button>
          ) : (
            <button
              onClick={handleBuyOrRedirect}
              className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition-colors duration-200"
            >
              Buy Now
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SingleProductView;
