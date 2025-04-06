
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <motion.div 
        className="text-center p-8 rounded-lg max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-8xl font-bold mb-4 text-rural-green">404</h1>
        <p className="text-xl text-white mb-2">Oops! This page couldn't be found</p>
        <p className="mb-8 text-gray-400 text-sm">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 rounded-full bg-rural-green hover:bg-rural-green/90 text-white transition-colors"
        >
          <Home className="mr-2 h-5 w-5" />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
