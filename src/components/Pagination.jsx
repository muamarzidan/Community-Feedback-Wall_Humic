import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];
    // Always show first page
    if (currentPage > 2) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="px-3 py-1 text-xl text-white cursor-pointer"
        >
          1
        </button>
      );
      
      if (currentPage > 3) {
        pages.push(<span key="dots1" className="px-2 text-white">...</span>);
      }
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`p-2 px-5 text-xl rounded-full cursor-pointer ${
            i === currentPage
              ? 'bg-white text-primary-500 font-bold'
              : 'text-white'
          }`}
        >
          {i}
        </button>
      );
    }

    // Always show last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push(<span key="dots2" className="px-2 text-white">...</span>);
      }
      
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-1 text-xl text-white cursor-pointer"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center min-w-[270px] max-w-[270px] p-2 rounded-full bg-primary-500">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous Page"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex items-center gap-1 rounded-full">
          {renderPageNumbers()}
        </div>
        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next Page"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
  );
};

export default Pagination;