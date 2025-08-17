import { useState, type FormEvent, type ChangeEvent, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface ProductForm {
  name: string;
  category: string;
  quantity: number;
  price: number;
  expiryDate: string;
  fileData: File | null;
}

const AddProductForm = () => {
  const [form, setForm] = useState<ProductForm>({
    name: "",
    category: "",
    quantity: 0,
    price: 0,
    expiryDate: "",
    fileData: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    if (
      !form.name ||
      !form.category ||
      !form.quantity ||
      !form.price ||
      !form.expiryDate ||
      !form.fileData
    ) {
      toast.error("Please fill all fields and select a file");
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
      formData.append("file", form.fileData);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_API}/api/products`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccessMsg("Product added successfully!");
      setForm({
        name: "",
        category: "",
        quantity: 0,
        price: 0,
        expiryDate: "",
        fileData: null,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex justify-center p-6 bg-gray-50 min-h-screen">
      <motion.form
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        

        {/* Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-1 font-medium text-sm text-left">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label htmlFor="category" className="mb-1 font-medium text-sm text-left">
            Category *
          </label>
          <input
            id="category"
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Enter category"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col">
          <label htmlFor="quantity" className="mb-1 font-medium text-sm text-left">
            Quantity *
          </label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label htmlFor="price" className="mb-1 font-medium text-sm text-left">
            Price *
          </label>
          <input
            id="price"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Expiry Date */}
        <div className="flex flex-col">
          <label htmlFor="expiryDate" className="mb-1 font-medium text-sm text-left">
            Expiry Date *
          </label>
          <input
            id="expiryDate"
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* File Upload */}
        <div className="flex flex-col">
          <label
            htmlFor="fileData"
            
            className="mb-1 font-medium text-sm text-left cursor-pointer text-orange-600 hover:underline"
            onClick={handleFileClick}
          >
            Upload Image *
          </label>
          <input
            ref={fileInputRef}
            id="fileData"
            type="file"
            accept="image/*"
            name="fileData"
            onChange={handleChange}
            className="hidden"
          />
          {form.fileData && (
            <p className="text-gray-600 text-sm mt-1">{form.fileData.name}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-500 transition-colors duration-200"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

        {successMsg && (
          <p className="text-green-600 text-center font-medium">{successMsg}</p>
        )}
      </motion.form>
    </div>
  );
};

export default AddProductForm;
