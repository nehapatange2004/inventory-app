import { useContext } from "react";
import { Link } from "react-router-dom";
import { auth } from "../wrapper/authWrapper";

const Navbar = () => {
  const { isUserLoggedIn, handlelogout, userDetails } = auth();
  return (
    <nav className="sticky top-0 bg-white/70 shadow-md border z-20 backdrop-blur-2xl">
      <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-orange-600">
          FoodInventory
        </Link>

        {/* Menu */}
        <div className="flex items-center space-x-4">
          {isUserLoggedIn ? (
            <>
            <Link
                to={"/"}
                className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                to={`${userDetails?.role==="admin"?"/admin": "/user"}`}
                className="cursor:pointer text-gray-700 hover:text-orange-600 transition-colors duration-200"
              >
                Profile
              </Link>
              
              <button
                onClick={handlelogout}
                className="cursor:pointer  py-1 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-gray-700 hover:text-orange-600 transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-orange-600 text-white px-4 py-1 rounded-md hover:bg-orange-500 transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
