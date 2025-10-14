import { useState, useMemo } from 'react';

export const usePagination = (items, itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    // Sort items by createdAt descending (newest first)
    const sortedItems = [...items].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedItems.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    goToPage(currentPage - 1);
  };

  // Reset to page 1 if current page is beyond total pages
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const resetToFirstPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPrevPage,
    resetToFirstPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};