import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  imageId: string;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    expiryDate: "",
    fileData: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/products/single/${id}`);
        setProduct(res.data);
        setForm({
          name: res.data.name,
          category: res.data.category,
          quantity: res.data.quantity,
          price: res.data.price,
          expiryDate: res.data.expiryDate.split("T")[0], // YYYY-MM-DD
          fileData: null,
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }finally {
      setLoading(false); // ensure loading is stopped even on error
    }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "fileData" && files) {
      setForm((prev) => ({ ...prev, fileData: files[0] }));
    } else if (name === "quantity" || name === "price") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.quantity || !form.price || !form.expiryDate) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category.trim().toLowerCase());
      formData.append("quantity", form.quantity.toString());
      formData.append("price", form.price.toString());
      formData.append("expiryDate", form.expiryDate);
      if (form.fileData) formData.append("file", form.fileData);

      await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/products/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product updated successfully!");
      navigate("/"); // redirect to product list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <p className="text-center mt-10">Loading...</p>;


  return (
    <div className="max-w-md mx-auto p-6">
      <motion.form
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-orange-600 text-center">
          Edit Product
        </h2>

        {/* Image Preview */}
        <div className="flex flex-col items-center">
          <img
            src={`${import.meta.env.VITE_BACKEND_API}/api/products/preview/${product.imageId}`}
            alt={form.name}
            className="w-40 h-40 object-cover rounded-md mb-2"
          />
          <label className="bg-gray-200 px-3 py-1 rounded cursor-pointer hover:bg-gray-300">
            Select Image
            <input
              type="file"
              name="fileData"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col space-y-3">
          <div>
            <label className="text-gray-600 text-sm font-medium">Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Category *</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Price *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Expiry Date *</label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-500 transition-colors duration-200"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </motion.form>
    </div>
  );
};

export default EditProduct;
