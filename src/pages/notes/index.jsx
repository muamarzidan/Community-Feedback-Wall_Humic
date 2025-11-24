import { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Heart, Calendar } from 'lucide-react';
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { useListNotes } from '../../hooks/useListNotes';
import Layout from '../../components/Layout';

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
  const itemsPerPage = 50;
  const datePickerRef = useRef(null);

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
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  // Filter notes by search query (frontend filtering)
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pagination handler
  const goToPage = (page) => {
    if (page >= 1 && page <= (pagination.total_pages || 1)) {
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
    const totalPages = pagination.total_pages || 1;
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

  const getNoteColor = (index) => {
    const colors = [
      'bg-[#FDE68A]',
      'bg-[#FECDD3]', 
      'bg-[#D9F99D]',
      // 'bg-blue-100',
      // 'bg-purple-100',
      // 'bg-orange-100'
    ];
    return colors[index % colors.length];
  };

  const getCircleColor = (index) => {
    const colors = [
      'bg-[#E4CF7C]',
      'bg-[#E5B9BE]', 
      'bg-[#A3C16AFF]',
      // 'bg-blue-200',
      // 'bg-purple-200',
      // 'bg-orange-200'
    ];
    return colors[index % colors.length];
  };

  const formatDateRange = () => {
    const start = format(dateRange[0].startDate, 'dd MMM yyyy');
    const end = format(dateRange[0].endDate, 'dd MMM yyyy');
    return start === end ? start : `${start} - ${end}`;
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
        <div className="px-6 py-4 space-y-4 bg-white border-b border-gray-200">
          {/* Notes Title Mobile */}
          <h1 className="block text-2xl font-bold text-center text-gray-900 sm:hidden">Notes</h1>
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Search */}
            <div className="relative w-full sm:max-w-[320px] xl:max-w-[768px] 2xl:max-w-[968px]">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3.5 pl-10 pr-4 text-xs border border-gray-300 rounded-xl sm:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Top Like, Newest & Date Picker */}
            <div className="flex items-center justify-between w-full gap-1 sm:gap-6 sm:w-fit">
              {/* Top Like, Newest */}
              <div className="flex items-center gap-1 px-1 py-1 border border-gray-300 rounded-full sm:px-2 sm:py-2 sm:gap-2 sm:rounded-xl">
                <button
                  onClick={() => setCurrentFilter('toplike')}
                  className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-full sm:rounded-lg text-[10px] sm:text-base font-medium transition-colors ${
                    currentFilter === 'toplike' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <Heart className={`hidden sm:inline-block w-4 h-4 ${currentFilter === 'toplike' ? 'fill-white' : ''}`} />
                  Top Like
                </button>
                <button
                  onClick={() => setCurrentFilter('newest')}
                  className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-full sm:rounded-lg text-[10px] sm:text-base font-medium transition-colors ${
                    currentFilter === 'newest' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <svg className="hidden w-4 h-4 sm:inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Newest
                </button>
              </div>
              {/* Date Range Picker */}
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="cursor-pointer flex items-center gap-2 px-3 py-2.5 text-[10px] text-gray-700 bg-white border border-gray-300 rounded-xl sm:text-lg hover:bg-gray-50"
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
                    />
                    <div className="flex justify-end gap-2 p-3 border-t">
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
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
        {/* Notes Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note, index) => {
              const noteColor = getNoteColor(index);
              const circleColor = getCircleColor(index);
              
              return (
                <div
                  key={note.id}
                  className={`${noteColor} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden`}
                >
                  {/* Decorative circle in top right */}
                  <div className={`absolute -top-8 -right-8 w-32 h-32 ${circleColor} rounded-full opacity-50`}></div>
                  
                  {/* Author */}
                  <div className="relative z-10 mb-3 text-xs font-medium text-gray-700 uppercase">
                    {note.author || 'Difa rindang utari'}
                  </div>

                  {/* Image if exists */}
                  {note.image && (
                    <div className="relative z-10 mb-4 overflow-hidden rounded-xl">
                      <img 
                        src={note.image} 
                        alt="Note attachment" 
                        className="object-cover w-full h-40"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 mb-4">
                    <h3 className="mb-2 text-base font-bold text-gray-900">
                      {note.title || 'Lorem ipsum dolor sit amet consectetur.'}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-700 line-clamp-3">
                      {note.content || note.description || 'Lorem ipsum dolor sit amet consectetur. Dignissim dictum ipsum morbi eget. Praesent Lorem ipsum dolor sit amet consectetur. Dignissim dictum ipsum morbi'}
                    </p>
                  </div>

                  {/* Bottom section */}
                  <div className="relative z-10 flex items-center justify-between pt-3 border-t border-gray-300">
                    {/* Reactions with background */}
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-full">
                        ❤️ <span className="font-medium text-gray-700">{note.reactions?.heart || 2}</span>
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-full">
                        👍 <span className="font-medium text-gray-700">{note.reactions?.thumbsUp || 3}</span>
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-full">
                        ⭐ <span className="font-medium text-gray-700">{note.reactions?.star || 2}</span>
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-full">
                        😊 <span className="font-medium text-gray-700">{note.reactions?.smile || 3}</span>
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 text-xs bg-white rounded-full">
                        🔥 <span className="font-medium text-gray-700">{note.reactions?.fire || 2}</span>
                      </span>
                    </div>

                    {/* Date */}
                    <div className="text-xs font-medium text-gray-600">
                      {format(new Date(note.createdAt), 'dd/MM/yyyy')}
                    </div>
                  </div>
                  
                  {/* Posted days ago */}
                  <div className="relative z-10 mt-2 text-xs text-gray-500">
                    Posted {Math.floor((Date.now() - new Date(note.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty state */}
          {filteredNotes.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No notes found matching your search.</p>
            </div>
          )}

          {/* Pagination */}
          {(pagination.total_pages || 1) > 1 && (
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
                  disabled={(pagination?.current_page || 1) === (pagination.total_pages || 1)}
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
    </Layout>
  );
}