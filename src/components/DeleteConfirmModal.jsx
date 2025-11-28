import { AlertTriangle } from 'lucide-react';


const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, noteTitle = '' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl animate-scaleIn">
                {/* Icon */}
                <div className="flex justify-center pt-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                </div>
                {/* Content */}
                <div className="p-6 text-center">
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                        Delete Note?
                    </h3>
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete this note?
                    </p>
                    {noteTitle && (
                        <p className="mt-2 text-sm font-medium text-gray-800">
                            "{noteTitle}"
                        </p>
                    )}
                    <p className="mt-3 text-xs text-gray-500">
                        This action cannot be undone.
                    </p>
                </div>
                {/* Action Button */}
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 font-medium cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-4 py-2.5 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 font-medium cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;