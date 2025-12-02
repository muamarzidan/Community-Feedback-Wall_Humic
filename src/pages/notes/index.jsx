import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Heart, Calendar, ArrowUp } from 'lucide-react';
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { useListNotes } from '../../hooks/useListNotes';
import { listNotesAPI } from '../../lib/api';
import { formatDateRange } from '../../utils/formatDate';
import Layout from '../../components/Layout';
import ImageViewer from '../../components/ImageViewer';
import GuestWarningModal from '../../components/GuestWarningModal';


export default function NotesListPage() {
  const { notes, loading, pagination, fetchNotes, updateLocalReaction } = useListNotes();
  const [allNotes, setAllNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('today');
  const [topLikeActive, setTopLikeActive] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const datePickerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    imageUrl: ''
  });
  const [guestWarningModal, setGuestWarningModal] = useState({
    isOpen: false,
    message: ''
  });
  
  
  const isAuthenticated = () => {
    return !!localStorage.getItem('token_community-feedback');
  };
  
  const itemsPerPage = 15;

  // Reset notes ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    // setLoadingMore(true);
    loadNotes(1, true);
  }, [currentFilter, dateRange, topLikeActive]);
  // Update notes dari hooks ke allNotes
  useEffect(() => {
    if (notes.length > 0) {
      setAllNotes(prev => {
        if (currentPage === 1) return notes;
        const existingIds = new Set(prev.map(n => n.id));
        const newNotes = notes.filter(n => !existingIds.has(n.id));
        return [...prev, ...newNotes];
      });
      setHasMore(pagination?.current_page < pagination?.last_page);
      setLoadingMore(false);
    }
  }, [notes, pagination]);
  // Deteksi scroll untuk infinite scroll & scroll to top
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollTop(scrollTop > 500);
      
      if (scrollHeight - scrollTop - clientHeight < 300 && !loadingMore && hasMore) {
        loadMore();
      };
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  const loadNotes = async (page = 1, reset = false) => {
    if (!reset) {
      setLoadingMore(true);
    };

    const params = {
      page: page,
      per_page: itemsPerPage,
      from_date: format(dateRange[0].startDate, 'yyyy-MM-dd'),
      to_date: format(dateRange[0].endDate, 'yyyy-MM-dd')
    };
    
    if (topLikeActive) {
      params.filter = 'top_like';
    };
    
    await fetchNotes(params);
  };
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadNotes(nextPage);
    };
  }, [currentPage, loadingMore, hasMore]);
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Tutup date picker saat klik di luar area date picker
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

  const filteredNotes = allNotes.filter(note => {
    const matchesSearch = note.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });
  
  // Pinterest-style Masonry Layout: Simpel distribusi ke 3 kolom
  const distributeNotesToColumns = (notes) => {
    const columns = [[], [], []]; // Set menjadi 3 kolom
    // Simpel round-robin distribusi
    notes.forEach((note, index) => {
      const columnIndex = index % 3;
      columns[columnIndex].push(note);
    });
    
    return columns;
  };
  const noteColumns = distributeNotesToColumns(filteredNotes);
  const handleImageClick = (imageUrl) => {
    setImageViewer({
      isOpen: true,
      imageUrl: imageUrl
    });
  };
  const handleReactionClick = async (noteId, reactionType) => {
    if (!isAuthenticated()) {
      setGuestWarningModal({
        isOpen: true,
        message: 'Please login to react to notes'
      });
      return;
    };
    
    try {
      const response = await listNotesAPI.toggleReaction(noteId, reactionType);
      if (response.data && response.data.data) {
        updateLocalReaction(noteId, response.data.data);
      };
    } catch (error) {
      console.error('Error toggling reaction:', error);
    };
  };
  const isMyNotes = (note) => {
    if (!isAuthenticated()) return false;
    
    if (note.userType === 'you') {
      return '(You)';
    };
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
            {/* Top Like & Date Picker */}
            <div className="flex items-center justify-between w-full gap-1 sm:gap-6 sm:w-fit">
              {/* Top Like */}
              <button
                onClick={() => setTopLikeActive(!topLikeActive)}
                className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-base font-medium transition-colors ${
                  topLikeActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${topLikeActive ? 'fill-white' : ''}`} />
                <span>Top Like</span>
              </button>
              {/* Date Range Picker */}
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="cursor-pointer flex items-center gap-2 px-3 py-2 text-[10px] text-gray-700 bg-white border border-gray-300 rounded-lg sm:text-lg hover:bg-gray-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{currentFilter === 'today' ? 'Today' : formatDateRange(dateRange)}</span>
                </button>
                {showDatePicker && (
                  <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                    <DateRangePicker
                      onChange={item => {
                        setDateRange([item.selection]);
                        setCurrentFilter('custom');
                      }}
                      showSelectionPreview={true}
                      moveRangeOnFirstSelection={false}
                      months={1}
                      ranges={dateRange}
                      direction="horizontal"
                      inputRanges={[]}
                    />
                    <div className="flex justify-end gap-2 p-3 border-t border-gray-100">
                      {/* <button
                        onClick={() => {
                          setDateRange([{
                            startDate: new Date(),
                            endDate: new Date(),
                            key: 'selection'
                          }]);
                          setCurrentFilter('today');
                          setShowDatePicker(false);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 !cursor-pointer"
                      >
                        Today
                      </button> */}
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
        {/* Notes */}
        <div ref={scrollContainerRef} className="relative flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {noteColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-6">
                {column.map((note) => (
                  <div
                    key={note.id}
                    className="relative p-4 overflow-hidden rounded-lg shadow-md sm:rounded-2xl"
                    style={{ backgroundColor: note.backgroundColor }}
                  >
                    {/* Decoration */}
                    <div className="absolute hidden w-24 h-24 bg-black rounded-full sm:inline opacity-10 -top-10 -right-10"></div>
                    {/* Author */}
                    <div className="flex justify-between relative z-10 mb-3 text-[10px] sm:text-base text-[#757575]">
                      <div><span>{note?.author}</span><span className="ml-2 font-semibold">{isMyNotes(note)}</span></div>
                      <div className="inline-block font-medium sm:hidden">{format(new Date(note.createdAt), 'dd/MM/yyyy')}</div>
                    </div>
                    {/* Image if exists */}
                    {note.image && (
                      <div 
                        className="relative z-10 mb-4 overflow-hidden rounded-md cursor-pointer sm:rounded-xl group"
                        onClick={() => handleImageClick(note.image)}
                      >
                        <img 
                          src={note.image} 
                          alt="Thumbnail - Agora" 
                          className="object-cover w-full transition-transform h-44 group-hover:scale-105"
                        />
                      </div>
                    )}
                    {/* Title & Description */}
                    <div className="relative z-10 mb-4">
                      <h3 className="text-xs font-bold text-black sm:text-base">
                        {note.title}
                      </h3>
                      <p className="text-[10px] leading-relaxed text-black sm:text-sm">
                        {note.description}
                      </p>
                    </div>
                    {/* Reaction */}
                    <div className="relative z-10 flex items-center justify-between sm:gap-3 sm:justify-start">
                        <button
                          onClick={() => handleReactionClick(note.id, 'heart')}
                          className={`flex items-center gap-1 px-3 py-1 text-[10px] sm:text-base text-black transition-all rounded-full cursor-pointer ${
                            note.userReactions?.includes('heart')
                              ? 'bg-red-100 border border-red-300'
                              : 'bg-white border border-gray-300 hover:bg-gray-100 '
                          }`}
                        >
                          ❤️ <span>{note.reactions?.heart || 0}</span>
                        </button>
                        <button
                          onClick={() => handleReactionClick(note.id, 'like')}
                          className={`flex items-center gap-1 px-3 py-1 text-[10px] sm:text-base text-black transition-all rounded-full cursor-pointer ${
                            note.userReactions?.includes('like')
                              ? 'bg-blue-50 border border-blue-300'
                              : 'bg-white border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          👍 <span>{note.reactions?.like || 0}</span>
                        </button>
                        <button
                          onClick={() => handleReactionClick(note.id, 'laugh')}
                          className={`flex items-center gap-1 px-3 py-1 text-[10px] sm:text-base text-black transition-all rounded-full cursor-pointer ${
                            note.userReactions?.includes('laugh')
                              ? 'bg-yellow-100 border border-yellow-500'
                              : 'bg-white border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          😂 <span>{note.reactions?.laugh || 0}</span>
                        </button>
                        <button
                          onClick={() => handleReactionClick(note.id, 'surprised')}
                          className={`flex items-center gap-1 px-3 py-1 text-[10px] sm:text-base text-black transition-all rounded-full cursor-pointer ${
                            note.userReactions?.includes('surprised')
                              ? 'bg-purple-100 border border-purple-300'
                              : 'bg-white border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          😮 <span>{note.reactions?.surprised || 0}</span>
                        </button>
                        <button
                          onClick={() => handleReactionClick(note.id, 'fire')}
                          className={`flex items-center gap-1 px-3 py-1 text-[10px] sm:text-base text-black transition-all rounded-full cursor-pointer ${
                            note.userReactions?.includes('fire')
                              ? 'bg-orange-100 border border-orange-300'
                              : 'bg-white border border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          🔥 <span>{note.reactions?.fire || 0}</span>
                        </button>
                    </div>
                    {/* Date */}
                    <div className="mt-2 text-[10px] sm:text-sm font-medium text-[#757575] sm:block hidden">
                      {format(new Date(note.createdAt), 'dd/MM/yyyy')}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* Loading More Indicator */}
          {loadingMore &&  (
            <div className="flex justify-center py-8">
              <div className="inline-block w-8 border-4 border-blue-500 rounded-full h- border-t-transparent animate-spin"></div>
            </div>
          )}
          {/* End of Results */}
          {!hasMore && allNotes.length > 0 && (
            <div className="py-8 text-center text-gray-500">
              <p>No more notes to load</p>
            </div>
          )}
          {/* Empty state */}
          {filteredNotes.length === 0 && !loading && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No notes found.</p>
            </div>
          )}
          {/* Scroll to Top Button */}
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed flex items-center justify-center w-12 h-12 text-white transition-all bg-blue-500 rounded-full shadow-lg cursor-pointer z-11 bottom-8 right-8 hover:bg-blue-600 hover:scale-110"
            >
              <ArrowUp className="w-6 h-6" />
            </button>
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
      {/* Guest Warning Modal */}
      <GuestWarningModal
        isOpen={guestWarningModal.isOpen}
        onClose={() => setGuestWarningModal({ isOpen: false, message: '' })}
        message={guestWarningModal.message}
      />
    </Layout>
  );
};