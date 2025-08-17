import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

const InventoryList = () => {
  interface productInterface {
    _id: string;
    name: string;
    category: string;
    imgURL: string;
    quantity: number;
    price: number;
    expiryDate: string;
  }

  const [products, setProducts] = useState<productInterface[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/products`
      );
      setProducts(response.data);
    };
    fetchDetails();
  }, []);

  return (
    <div className="px-2 mt-10 bg-gray-50 min-h-screen overflow-x-hidden max-w-[100vw]">
      <div className="flex flex-wrap justify-center gap-4">
        <AnimatePresence>
          {products?.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-64 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform duration-200 cursor-pointer"
            >
              <NavLink to={`/order/${item._id}`} className="w-64 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.01] transition-transform duration-200 cursor-pointer">
              {/* Image with gradient overlay */}
              <div className="relative h-40 overflow-hidden">
                <img
                  // src={item.imgURL || "data:image/jpeg;base64,..."} // fallback base64
                  src={`${import.meta.env.VITE_BACKEND_API}/api/products/preview/${item.imgURL}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-3">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.name}
                </h2>
                <span className="inline-block bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {item.category}
                </span>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm font-bold text-orange-600">
                    ₹{item.price}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                {item.expiryDate && (
                  <p className="text-xs text-red-500 mt-1">
                    Exp: {new Date(item.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              </NavLink>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InventoryList;
