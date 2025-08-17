import { XCircle } from "lucide-react";
import { motion } from "framer-motion";


export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Animated error icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-6"
      >
        <XCircle className="w-20 h-20 text-red-500" />
      </motion.div>

      {/* Error text */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Oops! Something went wrong ❌
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        We couldn’t process your request. Please try again later.
      </p>

      {/* Back to home button */}
      <button 
      type="button"
        onClick={() => (window.location.href = "/")}
        className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg"
      >
        Back to Home
      </button>
    </div>
  );
}
