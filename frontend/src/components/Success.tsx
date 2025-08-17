import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Animated check icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <CheckCircle className="w-20 h-20 text-green-500" />
      </motion.div>

      {/* Success text */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Order Confirmed 🎉
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Thank you for your purchase! Your order has been successfully placed.
      </p>

      {/* Back to home button */}
      <button
      type="button"
        onClick={() => (window.location.href = "/")}
        className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
      >
        Back to Home
      </button>
    </div>
  );
}
