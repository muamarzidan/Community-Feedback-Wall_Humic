import { useState } from 'react';
import { User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';

const Header = () => {
  const isLoggedIn = false;
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="px-4 py-2 text-xl font-bold text-gray-800 transition-colors bg-white rounded-lg hover:bg-gray-50">
          Logo
        </Link>
      </div>
      {/* Auth Section */}
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">Profile</span>
          </div>
        ) : (
          <div className="flex justify-center gap-12">
            <div className='flex items-center gap-4'>
              <input 
                type="text"
                placeholder="Search..."
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-4">
                <Link to="" className="text-sm text-gray-700 transition-colors hover:text-gray-900">
                  All
                </Link>
                <Link to="" className="text-sm text-gray-700 transition-colors hover:text-gray-900">
                  Top Like
                </Link>
                <Link to="" className="text-sm text-gray-700 transition-colors hover:text-gray-900">
                  Newest
                </Link>
              </div>
            </div>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg shadow-sm hover:bg-blue-600"
            >
              <span className="text-sm">Login</span>
              <LogIn className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </header>
  );
};

export default Header;