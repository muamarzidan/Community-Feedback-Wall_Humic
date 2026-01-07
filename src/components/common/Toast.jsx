import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';


const Toast = ({ message, type = 'success', isOpen, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        };
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: <CheckCircle className="w-5 h-5 text-green-600" />
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: <XCircle className="w-5 h-5 text-red-600" />
        }
    };
    const currentStyle = styles[type] || styles.success;

    return (
        <div className="fixed top-4 right-4 z-[9999] animate-slideInRight">
            <div className={`flex items-center gap-3 px-4 py-3 ${currentStyle.bg} border ${currentStyle.border} rounded-lg shadow-lg min-w-[300px] max-w-md`}>
                {currentStyle.icon}
                <p className={`flex-1 text-sm font-medium ${currentStyle.text}`}>
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className={`${currentStyle.text} hover:opacity-70 transition-opacity`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;