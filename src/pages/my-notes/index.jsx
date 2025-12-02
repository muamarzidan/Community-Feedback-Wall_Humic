import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ArrowUp } from 'lucide-react';
import { format } from 'date-fns';

import { userAPI, listNotesAPI } from '../../lib/api';
import Layout from '../../components/Layout';
import ImageViewer from '../../components/ImageViewer';
import GuestWarningModal from '../../components/GuestWarningModal';
import { getCurrentUser } from '../../utils/getCurrentUser';


export default function MyNotesPage() {
    const [allNotes, setAllNotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('my-notes');
    const [showScrollTop, setShowScrollTop] = useState(false);

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

    useEffect(() => {
        setCurrentPage(1);
        setHasMore(true);
        loadNotes(1, true);
    }, [activeFilter]);
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

        try {
            const params = {
                page: page,
                per_page: itemsPerPage,
            };

            let response;
            if (activeFilter === 'my-notes') {
                params.sort = 'newest';
                response = await userAPI.getMyNotes(params);
            } else {
                params.reaction_type = activeFilter;
                response = await userAPI.getMyReactions(params);
            };

            if (response.data && response.data.data) {
                const data = response.data.data;
                const transformedNotes = data.notes.map(note => transformNoteFromAPI(note));

                setAllNotes(prev => {
                    if (page === 1) return transformedNotes;
                    const existingIds = new Set(prev.map(n => n.id));
                    const newNotes = transformedNotes.filter(n => !existingIds.has(n.id));
                    return [...prev, ...newNotes];
                });

                setHasMore(data.pagination.current_page < data.pagination.last_page);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        };
    };
    const transformNoteFromAPI = (apiNote) => {
        const currentUser = getCurrentUser();

        let userType = 'guest';
        let authorName = 'Guest';
        if (apiNote.user) {
            authorName = apiNote.user.name;
            if (currentUser && apiNote.user.id === currentUser.id) {
                userType = 'you';
            } else {
                userType = 'people';
            };
        };

        return {
            id: apiNote.id,
            title: apiNote.title,
            description: apiNote.description,
            backgroundColor: apiNote.color ? `#${apiNote.color}` : '#fef3c7',
            author: authorName,
            userId: apiNote.user?.id || null,
            userType: userType,
            image: apiNote.image || null,
            reactions: {
                heart: apiNote.reactions?.heart || 0,
                like: apiNote.reactions?.like || 0,
                laugh: apiNote.reactions?.laugh || 0,
                surprised: apiNote.reactions?.surprised || 0,
                fire: apiNote.reactions?.fire || 0,
            },
            userReactions: apiNote.user_reactions || [],
            myReactions: apiNote.my_reactions || [],
            latestReactionAt: apiNote.latest_reaction_at || null,
            createdAt: apiNote.created_at,
            updatedAt: apiNote.updated_at,
        };
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
    const filteredNotes = allNotes.filter(note => {
        const matchesSearch = note.title?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });
    const distributeNotesToColumns = (notes) => {
        const columns = [[], [], []];
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
                setAllNotes(prevNotes => prevNotes.map(note => {
                    if (note.id === noteId) {
                        return {
                            ...note,
                            reactions: {
                                heart: response.data.data.reactions?.heart || 0,
                                like: response.data.data.reactions?.like || 0,
                                laugh: response.data.data.reactions?.laugh || 0,
                                surprised: response.data.data.reactions?.surprised || 0,
                                fire: response.data.data.reactions?.fire || 0,
                            },
                            userReactions: response.data.data.user_reactions || [],
                        };
                    }
                    return note;
                }));
            }
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

    const reactionButtons = [
        { type: 'heart', emoji: '❤️', label: 'Heart' },
        { type: 'like', emoji: '👍', label: 'Like' },
        { type: 'laugh', emoji: '😂', label: 'Laugh' },
        { type: 'surprised', emoji: '😮', label: 'Surprised' },
        { type: 'fire', emoji: '🔥', label: 'Fire' },
    ];

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
                        {/* Title */}
                        <h1 className="text-2xl font-bold text-center text-gray-900 sm:text-left">My Notes</h1>
                        {/* Search */}
                        <div className="relative w-full">
                            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type="text"
                                placeholder="Search my notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3 pl-10 pr-4 text-xs border border-gray-300 rounded-xl sm:text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Filter Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* My Notes Button */}
                            <button
                                onClick={() => setActiveFilter('my-notes')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeFilter === 'my-notes'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                My Notes
                            </button>
                            {/* Reaction Filters */}
                            {reactionButtons.map((reaction) => (
                                <button
                                    key={reaction.type}
                                    onClick={() => setActiveFilter(reaction.type)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${activeFilter === reaction.type
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>{reaction.emoji}</span>
                                    <span className="hidden sm:inline">{reaction.label}</span>
                                </button>
                            ))}
                        </div>
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
                        {loadingMore && (
                            <div className="flex justify-center py-8">
                                <div className="inline-block w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
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
                                <p className="text-gray-500">
                                    {activeFilter === 'my-notes'
                                        ? 'You haven\'t created any notes yet.'
                                        : `You haven't reacted with ${activeFilter} yet.`}
                                </p>
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