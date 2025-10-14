import { User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const isLoggedIn = false;

  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between shadow-sm bg-white">
      {/* Logo/Brand */}
      <div className="flex items-center">
        <Link to="/" className="text-xl font-bold text-gray-800 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          Logo
        </Link>
      </div>
      {/* Auth Section */}
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">Profile</span>
          </div>
        ) : (
          <div className="flex justify-center gap-12">
            <div className='flex items-center gap-4'>
              <input 
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-4">
                <Link to="" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  All
                </Link>
                <Link to="" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Top Like
                </Link>
                <Link to="" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Newest
                </Link>
              </div>
            </div>
            <Link to="/login" className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition-colors">
              <span className="text-sm">Login</span>
              <LogIn className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;