import { useState, useEffect } from 'react';

import { usePagination } from './hooks/usePagination';
import { useCursorMode } from './contexts/CursorModeContext';
import { useCanvasNotes } from './hooks/useCanvasNotes';
import { closeAllMenus } from './utils/domUtils';
import Layout from './components/Layout';
import NotesCanvas from './components/NotesCanvas';
import CreateNoteButton from './components/CreateNoteButton';
import CursorModeToggle from './components/CursorModeToggle';
import ZoomControls from './components/ZoomControls';
import Pagination from './components/Pagination';
import NoteModal from './components/NoteModal';
import GuestWarningModal from './components/GuestWarningModal';
import ImageViewer from './components/ImageViewer';
import './App.css';


function App() {
  const { notes, 
    // canvasInfo, 
    addNote, updateNote, deleteNote, updateReaction, loading, isAuthenticated, canGuestCreateNote } = useCanvasNotes();
  const { currentPage, totalPages, paginatedItems, goToPage, resetToFirstPage } = usePagination(notes, 50);
  const { cursorMode, setCursorMode } = useCursorMode();
  const [zoom, setZoom] = useState(1);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    editingNote: null
  });
  const [guestWarningModal, setGuestWarningModal] = useState({
    isOpen: false,
    message: ''
  });
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    imageUrl: ''
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };
  const handleCreateNote = () => {
    setModalState({
      isOpen: true,
      editingNote: null
    });
  };
  const handleEditNote = (note) => {
    setModalState({
      isOpen: true,
      editingNote: note
    });
  };
  const handleSaveNote = async (noteData) => {
    try {
      if (modalState.editingNote) {
        await updateNote(modalState.editingNote.id, noteData);
      } else {
        // Check if guest can create note
        if (!isAuthenticated() && !canGuestCreateNote()) {
          alert('Guest users can only create 1 note per day. Please login to create more notes.');
          return;
        };
        
        await addNote(noteData);
        // Navigate to page 1 to show the new note
        setTimeout(() => resetToFirstPage(), 100);
      };
      
      setModalState({
        isOpen: false,
        editingNote: null
      });
    } catch (error) {
      console.error('Error saving note:', error);
      alert(error.message || 'Failed to save note. Please try again.');
    };
  };
  const handleDeleteNote = async (noteId) => {
    if (!isAuthenticated()) {
      alert('Only logged in users can delete notes.');
      return;
    };
    
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
      };
    };
  };
  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      editingNote: null
    });
  };
  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      closeAllMenus();
    };
  };
  const handleGuestWarning = (message) => {
    setGuestWarningModal({
      isOpen: true,
      message: message
    });
  };
  const handleImageClick = (imageUrl) => {
    setImageViewer({
      isOpen: true,
      imageUrl: imageUrl
    });
  };
  const handleCloseImageViewer = () => {
    setImageViewer({
      isOpen: false,
      imageUrl: ''
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
        <div className="relative w-full h-screen overflow-hidden bg-center bg-cover canvas-page bg-gray-50">
          <NotesCanvas
            notes={paginatedItems}
            zoom={zoom}
            cursorMode={cursorMode}
            width={dimensions.width}
            height={dimensions.height}
            onNoteEdit={handleEditNote}
            onNoteDelete={handleDeleteNote}
            onReactionUpdate={updateReaction}
            onStageClick={handleStageClick}
            onGuestWarning={handleGuestWarning}
            onImageClick={handleImageClick}
          />
        {/* Pagination */}
        <div className="absolute z-50 transform -translate-x-1/2 bottom-20 sm:bottom-6 left-1/2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
        {/* Cursor Mode */}
        <div className="absolute z-50 flex flex-col gap-3 right-6 top-4 sm:right-32 sm:top-6">
          <CursorModeToggle 
            cursorMode={cursorMode}
            onModeChange={(newMode) => {
              // Close any open menus when changing cursor mode
              closeAllMenus();
              setCursorMode(newMode);
            }}
          />
        </div>
        {/* Zoom Control */}
        <div className="absolute z-50 right-6 bottom-50 sm:bottom-24 sm:right-32">
          <ZoomControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
        </div>
        {/* Create Note */}
        <div className="absolute z-50 flex flex-col gap-3 right-7 bottom-36 sm:bottom-6 sm:right-32">
          <CreateNoteButton onClick={handleCreateNote} />
        </div>
        </div>
      )}
        {/* Note Modal */}
        <NoteModal
          isOpen={modalState.isOpen}
          note={modalState.editingNote}
          onSave={handleSaveNote}
          onClose={handleCloseModal}
        />
        
        {/* Guest Warning Modal */}
        <GuestWarningModal
          isOpen={guestWarningModal.isOpen}
          message={guestWarningModal.message}
          onClose={() => setGuestWarningModal({ isOpen: false, message: '' })}
        />
        
        {/* Image Viewer Modal */}
        <ImageViewer
          isOpen={imageViewer.isOpen}
          imageUrl={imageViewer.imageUrl}
          onClose={handleCloseImageViewer}
        />
    </Layout>
  );
}

export default App;