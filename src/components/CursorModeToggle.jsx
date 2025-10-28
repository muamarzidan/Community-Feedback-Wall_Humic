import { Hand, MousePointer } from 'lucide-react';

const CursorModeToggle = ({ cursorMode, onModeChange }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg shadow-[0_2px_8px_0_rgba(0,0,0,0.1)]">
      <button
        onClick={() => onModeChange('default')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${
          cursorMode === 'default' 
            ? 'bg-primary-500 text-white' 
            : 'text-primary-500 hover:bg-primary-50'
        }`}
        title="Default Cursor"
      >
        <MousePointer className="w-5 h-5" />
      </button>
      <button
        onClick={() => onModeChange('drag')}
        className={`p-2 rounded-md transition-colors cursor-pointer ${
          cursorMode === 'drag' 
            ? 'bg-primary-500 text-white' 
            : 'text-primary-500 hover:bg-primary-50'
        }`}
        title="Drag Mode"
      >
        <Hand className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CursorModeToggle;