import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';


const Pagination = ({ currentCanvasId, navigation, onCanvasChange, onPrevious, onNext, onGoToCurrent }) => {
  const [inputPage, setInputPage] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Get current active canvas ID from navigation
  const currentActiveCanvasId = navigation?.current_active_canvas?.id;
  const isViewingCurrentCanvas = currentCanvasId === currentActiveCanvasId;

  // Build canvas numbers array (display canvas IDs in descending order)
  // Canvas IDs go: 1, 2, 3, 4, 5, 6 (oldest to newest)
  // Display order: 6, 5, 4, 3, 2, 1 (showing actual canvas IDs, newest to oldest)
  const renderCanvasNumbers = () => {
    if (!currentActiveCanvasId || !currentCanvasId) return [];
    
    const pages = [];
    const totalCanvases = currentActiveCanvasId;
    
    // Always show newest canvas (highest ID)
    if (currentCanvasId < totalCanvases - 1) {
      pages.push(
        <button
          key={totalCanvases}
          onClick={() => onCanvasChange(totalCanvases)}
          className="w-8 h-8 text-xs text-white cursor-pointer sm:w-10 sm:h-10 sm:text-lg"
        >
          {totalCanvases}
        </button>
      );
      
      if (currentCanvasId < totalCanvases - 2) {
        pages.push(<span key="dots1" className="px-2 text-white">...</span>);
      }
    }
    
    // Show canvas IDs around current canvas
    for (let id = Math.min(totalCanvases, currentCanvasId + 1); id >= Math.max(1, currentCanvasId - 1); id--) {
      pages.push(
        <button
          key={id}
          onClick={() => onCanvasChange(id)}
          className={`h-8 w-8 sm:w-10 sm:h-10 rounded-full cursor-pointer ${
            id === currentCanvasId
              ? 'bg-white text-primary-500 font-bold text-sm sm:text-xl'
              : 'text-white text-xs sm:text-lg'
          }`}
        >
          {id}
        </button>
      );
    }
    
    // Always show oldest canvas (canvas ID 1)
    if (currentCanvasId > 2) {
      if (currentCanvasId > 3) {
        pages.push(<span key="dots2" className="px-2 text-white">...</span>);
      }
      
      pages.push(
        <button
          key={1}
          onClick={() => onCanvasChange(1)}
          className="w-8 h-8 text-xs text-white cursor-pointer sm:w-10 sm:h-10 sm:text-lg"
        >
          {1}
        </button>
      );
    }
    
    return pages;
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const canvasId = parseInt(inputPage);
    const totalCanvases = currentActiveCanvasId;
    
    if (canvasId >= 1 && canvasId <= totalCanvases) {
      onCanvasChange(canvasId);
      setInputPage('');
      setShowInput(false);
    }
  };

  if (!currentCanvasId || !currentActiveCanvasId) return null;

  // Correct navigation logic:
  // - previous_canvas from BE = older canvas (lower ID)
  // - next_canvas from BE = newer canvas (higher ID)
  const hasNewerCanvas = !!navigation?.next_canvas; // Can go to newer (higher ID)
  const hasOlderCanvas = !!navigation?.previous_canvas; // Can go to older (lower ID)
  const totalCanvases = currentActiveCanvasId;

  return (
    <div className="flex items-center justify-between p-1 rounded-full w-fit sm:p-2 bg-primary-500">
      {/* Previous Button (go to newer/higher canvas ID) */}
      <button
        onClick={onNext}
        disabled={!hasNewerCanvas}
        className="px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title="Newer Canvas"
      >
        <ChevronLeft className="w-4 h-4 text-white sm:w-6 sm:h-6" />
      </button>
      {/* Canvas Numbers */}
      <div className="flex items-center gap-1 rounded-full">
        {showInput ? (
          <form onSubmit={handleInputSubmit} className="flex items-center">
            <input
              type="number"
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              onBlur={() => setShowInput(false)}
              min="1"
              max={totalCanvases}
              className="w-12 px-2 py-1 text-sm text-center text-black rounded"
              autoFocus
              placeholder="#"
            />
          </form>
        ) : (
          <div onClick={() => setShowInput(true)} className="cursor-pointer">
            {renderCanvasNumbers()}
          </div>
        )}
      </div>
      {/* Next Button (go to older/lower canvas ID) */}
      <button
        onClick={onPrevious}
        disabled={!hasOlderCanvas}
        className="px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title="Older Canvas"
      >
        <ChevronRight className="w-4 h-4 text-white sm:w-6 sm:h-6 " />
      </button>
    </div>
  );
};

export default Pagination;