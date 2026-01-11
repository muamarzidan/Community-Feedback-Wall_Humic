import { useEffect } from 'react';
import { X } from 'lucide-react';


const ImageViewer = ({ isOpen, imageUrl, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            };
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        };
        
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 animate-fadeIn"
            onClick={onClose}
        >
            {/* Image Container */}
            <div
                className="relative flex flex-col items-center justify-center w-full h-full p-4 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Image */}
                <div className="relative flex items-center justify-center w-full h-full mb-4">
                    <img
                        src={imageUrl}
                        alt="Fullscreen view"
                        className="object-contain w-full h-full max-h-[calc(100vh-120px)] animate-scaleIn"
                        style={{
                            maxWidth: '100%',
                            maxHeight: 'calc(100vh - 120px)',
                        }}
                    />
                </div>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-6 py-3 text-white transition-all bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 active:scale-95 "
                >
                    <X className="w-5 h-5" />
                    <span className="font-medium">Close</span>
                </button>
            </div>
        </div>
    );
};

export default ImageViewer;