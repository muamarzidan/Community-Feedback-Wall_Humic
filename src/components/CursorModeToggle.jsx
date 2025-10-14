import { Hand, MousePointer } from 'lucide-react';

const CursorModeToggle = ({ cursorMode, onModeChange }) => {
  return (
    <div className="absolute bottom-9 left-1/2 transform -translate-x-40 z-50">
      <div className="flex items-center gap-1 bg-white rounded-lg shadow-lg p-1">
        <button
          onClick={() => onModeChange('default')}
          className={`p-2 rounded-md transition-colors ${
            cursorMode === 'default' 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Default Cursor"
        >
          <MousePointer className="w-4 h-4" />
        </button>
        <button
          onClick={() => onModeChange('drag')}
          className={`p-2 rounded-md transition-colors ${
            cursorMode === 'drag' 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Drag Mode"
        >
          <Hand className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CursorModeToggle;