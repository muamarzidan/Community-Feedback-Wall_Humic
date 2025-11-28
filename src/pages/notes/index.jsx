import { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Heart, Calendar, Clock10 } from 'lucide-react';
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { useListNotes } from '../../hooks/useListNotes';
import Layout from '../../components/Layout';
import ImageViewer from '../../components/ImageViewer';


export default function NotesListPage() {
  const { notes, loading, pagination, fetchNotes } = useListNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('newest');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const datePickerRef = useRef(null);
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    imageUrl: ''
  });
  
  
  const itemsPerPage = 9; // Changed to 15 for masonry layout
  const colors = [
    '#E4CF7C',
    '#E5B9BE',
    '#C4E18E',
    '#A3C4E6',
    '#916A9C',
  ];

  // Fetch notes when filter or date range changes
  useEffect(() => {
    const params = {
      filter: currentFilter === 'toplike' ? 'top_like' : 'newest',
      page: pagination?.current_page || 1,
      per_page: itemsPerPage,
      from_date: format(dateRange[0].startDate, 'yyyy-MM-dd'),
      to_date: format(dateRange[0].endDate, 'yyyy-MM-dd'),
      search: searchQuery
    };
    fetchNotes(params);
  }, [currentFilter, dateRange]);
  // Fetch notes when filter or date range changes
  useEffect(() => {
    const params = {
      filter: currentFilter === 'toplike' ? 'top_like' : 'newest',
      page: pagination?.current_page || 1,
      per_page: itemsPerPage,
      from_date: format(dateRange[0].startDate, 'yyyy-MM-dd'),
      to_date: format(dateRange[0].endDate, 'yyyy-MM-dd')
    };
    fetchNotes(params);
  }, [currentFilter, dateRange]);
  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      };
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    };

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Filter notes by search query (frontend filtering)
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  
  // Masonry Layout: Distribute notes into 3 columns based on height
  const distributeNotesToColumns = (notes) => {
    const columns = [[], [], []]; // 3 columns
    const columnHeights = [0, 0, 0]; // Track height of each column
    
    // Estimate card height (card with image ~500px, without image ~220px)
    const estimateCardHeight = (note) => {
      const baseHeight = 220; // Base card height
      const imageHeight = note.image ? 160 : 0; // Image adds ~160px
      const titleHeight = Math.ceil((note.title?.length || 0) / 30) * 24; // ~30 chars per line
      const descHeight = Math.ceil((note.description?.length || 0) / 50) * 20; // ~50 chars per line
      return baseHeight + imageHeight + titleHeight + descHeight;
    };
    
    notes.forEach((note) => {
      // Find the shortest column
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // Add note to shortest column
      columns[shortestColumnIndex].push(note);
      
      // Update column height
      columnHeights[shortestColumnIndex] += estimateCardHeight(note);
    });
    
    return columns;
  };
  
  const noteColumns = distributeNotesToColumns(filteredNotes);
  
  const goToPage = (page) => {
    if (page >= 1 && page <= (pagination?.last_page || 1)) {
      const params = {
        filter: currentFilter === 'toplike' ? 'top_like' : 'newest',
        page: page,
        per_page: itemsPerPage,
        from_date: format(dateRange[0].startDate, 'yyyy-MM-dd'),
        to_date: format(dateRange[0].endDate, 'yyyy-MM-dd')
      };
      fetchNotes(params);
    }
  };
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination?.last_page || 1;
    const currentPage = pagination?.current_page || 1;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };
  const formatDateRange = () => {
    const start = format(dateRange[0].startDate, 'dd MMM yyyy');
    const end = format(dateRange[0].endDate, 'dd MMM yyyy');
    return start === end ? start : `${start} - ${end}`;
  };
  
  const handleImageClick = (imageUrl) => {
    setImageViewer({
      isOpen: true,
      imageUrl: imageUrl
    });
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen bg-gray-50">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading notes...</p>
          </div>
        </div>
      ) : (
      <div className="flex flex-col h-full overflow-hidden bg-gray-50">
        {/* Header */}
        <div className="px-6 py-4 space-y-4 bg-white">
          {/* Notes Title Mobile */}
          <h1 className="block text-2xl font-bold text-center text-gray-900 sm:hidden">Notes</h1>
          <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            {/* Search */}
            <div className="relative w-full lg:max-w-[320px] xl:max-w-[768px] 2xl:max-w-[968px]">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-xs border border-gray-300 rounded-xl sm:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Top Like, Newest & Date Picker */}
            <div className="flex items-center justify-between w-full gap-1 sm:gap-6 sm:w-fit">
              {/* Top Like, Newest */}
              <div className="flex items-center gap-1 px-1 py-1 border border-gray-300 rounded-full sm:px-2 sm:py-2 sm:gap-2 sm:rounded-xl">
                <button
                  onClick={() => setCurrentFilter('toplike')}
                  className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full sm:rounded-lg text-[10px] sm:text-base font-medium transition-colors ${
                    currentFilter === 'toplike' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <Heart className={`hidden sm:inline-block w-5 h-5 ${currentFilter === 'toplike' ? 'fill-white' : ''}`} />
                  Top Like
                </button>
                <button
                  onClick={() => setCurrentFilter('newest')}
                  className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full sm:rounded-lg text-[10px] sm:text-base font-medium transition-colors ${
                    currentFilter === 'newest' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <Clock10 className={`hidden sm:inline-block w-5 h-5 ${currentFilter === 'newest' ? '' : ''}`} />
                  Newest
                </button>
              </div>
              {/* Date Range Picker */}
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="cursor-pointer flex items-center gap-2 px-3 py-2 text-[10px] text-gray-700 bg-white border border-gray-300 rounded-lg sm:text-lg hover:bg-gray-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateRange()}</span>
                </button>
                {showDatePicker && (
                  <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <DateRangePicker
                      onChange={item => setDateRange([item.selection])}
                      showSelectionPreview={true}
                      moveRangeOnFirstSelection={false}
                      months={1}
                      ranges={dateRange}
                      direction="horizontal"
                      inputRanges={[]}
                    />
                    <div className="flex justify-end gap-2 p-3 border-t border-gray-100">
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 !cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Notes Title Desktop */}
          <h2 className="hidden text-2xl font-bold text-gray-900 sm:block">Notes</h2>
        </div>
        {/* Notes Grid - Masonry Layout */}
        <div className="flex-1 p-6 overflow-auto">
          {/* 3 Column Masonry Layout */}
          <div className="flex gap-6">
            {noteColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col flex-1 gap-6">
                {column.map((note) => {
                  const circleColor = () => {
                    if (note.backgroundColor === '#FFFB00') return colors[0];
                    if (note.backgroundColor === '#FECBEB') return colors[1];
                    if (note.backgroundColor === '#9DFFCB') return colors[2];
                    if (note.backgroundColor === '#B5D9FF') return colors[3];
                    if (note.backgroundColor === '#F2C5FF') return colors[4];
                    return colors[0];
                  };
                  
                  return (
                    <div
                      key={note.id}
                      className="relative p-4 overflow-hidden shadow-md rounded-2xl"
                      style={{ backgroundColor: note.backgroundColor }}
                    >
                      {/* Decorative circle background */}
                      <div
                        className="absolute w-32 h-32 rounded-full -top-14 -right-14"
                        style={{ backgroundColor: circleColor() }}
                      ></div>
                      {/* Author */}
                      <div className="relative z-10 mb-3 text-xs font-medium text-gray-700 uppercase">
                        {note?.author}
                      </div>
                      {/* Image if exists */}
                      {note.image && (
                        <div 
                          className="relative z-10 mb-4 overflow-hidden cursor-pointer rounded-xl group"
                          onClick={() => handleImageClick(note.image)}
                        >
                          <img 
                            src={note.image} 
                            alt="Note attachment" 
                            className="object-cover w-full transition-transform h-44 group-hover:scale-105"
                          />
                        </div>
                      )}
                      {/* Content */}
                      <div className="relative z-10 mb-4">
                        <h3 className="mb-2 text-base font-bold text-black">
                          {note.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-black">
                          {note.description}
                        </p>
                      </div>
                      {/* Reaction */}
                      <div className="relative z-10 flex items-center justify-start">
                        {/* Reactions with background */}
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-full">
                            ❤️ <span className="font-medium text-gray-700">{note.reactions?.heart || 0}</span>
                          </span>
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-full">
                            👍 <span className="font-medium text-gray-700">{note.reactions?.like || 0}</span>
                          </span>
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-full">
                            😂 <span className="font-medium text-gray-700">{note.reactions?.laugh || 0}</span>
                          </span>
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-full">
                            😊 <span className="font-medium text-gray-700">{note.reactions?.surprised || 0}</span>
                          </span>
                          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-full">
                            🔥 <span className="font-medium text-gray-700">{note.reactions?.fire || 0}</span>
                          </span>
                        </div>
                      </div>
                      {/* Date */}
                      <div className="mt-2 text-xs font-medium text-gray-600">
                        {format(new Date(note.createdAt), 'dd/MM/yyyy')}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* Empty state */}
          {filteredNotes.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No notes found.</p>
            </div>
          )}
          {/* Pagination */}
          {(pagination?.last_page || 1) > 1 && (
            <div className="flex items-center justify-center mt-8 mb-4">
              <div className="flex items-center gap-1 px-2 py-2 bg-white border border-blue-500 rounded-full shadow-sm">
                <button
                  onClick={() => goToPage((pagination?.current_page || 1) - 1)}
                  disabled={(pagination?.current_page || 1) === 1}
                  className="flex items-center justify-center w-10 h-10 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {getPageNumbers().map((page, idx) => (
                  page === '...' ? (
                    <span key={`dots-${idx}`} className="px-3 py-2 text-sm text-gray-500">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-full font-medium text-sm transition-colors ${
                        (pagination?.current_page || 1) === page
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}

                <button
                  onClick={() => goToPage((pagination?.current_page || 1) + 1)}
                  disabled={(pagination?.current_page || 1) === (pagination?.last_page || 1)}
                  className="flex items-center justify-center w-10 h-10 text-white transition-colors bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
      {/* Image Viewer Modal */}
      <ImageViewer
        isOpen={imageViewer.isOpen}
        imageUrl={imageViewer.imageUrl}
        onClose={() => setImageViewer({ isOpen: false, imageUrl: '' })}
      />
    </Layout>
  );
};