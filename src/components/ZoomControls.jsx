import { ZoomIn, ZoomOut } from 'lucide-react';

const ZoomControls = ({ zoom, onZoomIn, onZoomOut }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-fit">
      <button
        onClick={onZoomOut}
        className="flex items-center justify-center p-3 transition-colors rounded-full cursor-pointer bg-primary-500 w-fit hover:bg-primary-700"
        title="Zoom Out"
      >
        <ZoomOut className="w-6 h-6 text-gray-50" />
      </button>
      <div className="px-[12px] py-[15px] w-fit flex justify-center items-center text-xs text-gray-50 text-center min-w-[40px] bg-primary-500 rounded-full hover:bg-primary-700">
        <span className="!text-xs">{Math.round(zoom * 100)}%</span>
      </div>
      <button
        onClick={onZoomIn}
        className="flex items-center justify-center p-3 transition-colors rounded-full cursor-pointer bg-primary-500 w-fit hover:bg-primary-700"
        title="Zoom In"
      >
        <ZoomIn className="w-6 h-6 text-gray-50" />
      </button>
    </div>
  );
};

export default ZoomControls;