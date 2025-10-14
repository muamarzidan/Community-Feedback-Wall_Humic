import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];
    // const showPages = 3; // Show current page + 1 before + 1 after

    // Always show first page
    if (currentPage > 2) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 text-sm bg-white rounded hover:bg-gray-50"
        >
          1
        </button>
      );
      
      if (currentPage > 3) {
        pages.push(<span key="dots1" className="px-2 text-gray-400">...</span>);
      }
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 text-sm rounded ${
            i === currentPage
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Always show last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>);
      }
      
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 text-sm bg-white rounded hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="absolute bottom-4 left-4 z-50">
      <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="flex items-center gap-1">
          {renderPageNumbers()}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;