import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const Pagination = ({ currentPage, totalPages, navigation, onCanvasChange, onPrevious, onNext }) => {
  const renderCanvasNumbers = () => {
    if (!totalPages || !currentPage) return [];
    
    const pages = [];
    const totalCanvases = totalPages;
    
    if (currentPage < totalCanvases - 1) {
      pages.push(
        <button
          key={totalCanvases}
          onClick={() => onCanvasChange(totalCanvases)}
          className="w-8 h-8 text-xs text-white cursor-pointer sm:w-10 sm:h-10 sm:text-lg"
        >
          {totalCanvases}
        </button>
      );
      
      if (currentPage < totalCanvases - 2) {
        pages.push(<span key="dots1" className="px-2 text-white">...</span>);
      }
    }
    for (let id = Math.min(totalCanvases, currentPage + 1); id >= Math.max(1, currentPage - 1); id--) {
      pages.push(
        <button
          key={id}
          onClick={() => onCanvasChange(id)}
          className={`h-8 w-8 sm:w-10 sm:h-10 rounded-full cursor-pointer ${
            id === currentPage
              ? 'bg-white text-primary-500 font-bold text-sm sm:text-xl'
              : 'text-white text-xs sm:text-lg'
          }`}
        >
          {id}
        </button>
      );
    }
    if (currentPage > 2) {
      if (currentPage > 3) {
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

  if (!currentPage || !totalPages) return null;

  const hasNewerCanvas = !!navigation?.next_page;
  const hasOlderCanvas = !!navigation?.previous_page;

  return (
    <div className="flex items-center justify-between p-1 rounded-full w-fit sm:p-2 bg-primary-500">
      <button
        onClick={onNext}
        disabled={!hasNewerCanvas}
        className="px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        title="Newer Canvas"
      >
        <ChevronLeft className="w-4 h-4 text-white sm:w-6 sm:h-6" />
      </button>
      <div className="flex items-center gap-1 rounded-full">
        {renderCanvasNumbers()}
      </div>
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