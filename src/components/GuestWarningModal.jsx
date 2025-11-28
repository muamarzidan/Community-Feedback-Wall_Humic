import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const GuestWarningModal = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();


  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Login Required
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors cursor-pointer hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600">
            {message || 'You need to login to perform this action.'}
          </p>
        </div>
        {/* Button Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestWarningModal;