import { Plus, Minus } from 'lucide-react';

const ZoomControls = ({ zoom, onZoomIn, onZoomOut }) => {
  return (
    <div className="absolute bottom-4 right-4 z-50">
      <div className="flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={onZoomIn}
          className="p-1 flex justify-center items-center hover:bg-gray-100 rounded transition-colors"
          title="Zoom In"
        >
          <Plus className="w-5 h-5 text-gray-600" />
        </button>
        {/* <div className="p-1 flex justify-center items-center py-1 text-xs text-gray-500 text-center min-w-[40px]">
          {Math.round(zoom * 100)}%
        </div> */}
        <button
          onClick={onZoomOut}
          className="p-1 flex justify-center items-center hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ZoomControls;