import { useState, useEffect } from 'react';
import { ZoomIn } from 'lucide-react';

import { usePagination } from './hooks/usePagination';
import { useCursorMode } from './contexts/CursorModeContext';
import { useNotes } from './hooks/useNotes';
import { closeAllMenus } from './utils/domUtils';
import Layout from './components/Layout';
import NotesCanvas from './components/NotesCanvas';
import CreateNoteButton from './components/CreateNoteButton';
import CursorModeToggle from './components/CursorModeToggle';
import ZoomControls from './components/ZoomControls';
import Pagination from './components/Pagination';
import NoteModal from './components/NoteModal';
import './App.css';

function App() {
  const { notes, addNote, updateNote, deleteNote, updateReaction } = useNotes();
  const { currentPage, totalPages, paginatedItems, goToPage, resetToFirstPage } = usePagination(notes, 5);
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
  const handleSaveNote = (noteData) => {
    if (modalState.editingNote) {
      updateNote(modalState.editingNote.id, noteData);
    } else {
      addNote(noteData);
      // Navigate to page 1 to show the new note
      setTimeout(() => resetToFirstPage(), 100); // Small delay to ensure state update
    }
    
    setModalState({
      isOpen: false,
      editingNote: null
    });
  };
  const handleDeleteNote = (noteId) => {
    deleteNote(noteId);
  };
  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      editingNote: null
    });
  };
  const handleStageClick = (e) => {
    // Close any open menus when clicking on empty space
    if (e.target === e.target.getStage()) {
      closeAllMenus();
    }
  };

  return (
    <Layout>
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
        <div className="absolute z-50 flex flex-col gap-3 right-6 bottom-36 sm:bottom-6 sm:right-32">
          <CreateNoteButton onClick={handleCreateNote} />
        </div>
        {/* Note Modal */}
        <NoteModal
          isOpen={modalState.isOpen}
          note={modalState.editingNote}
          onSave={handleSaveNote}
          onClose={handleCloseModal}
        />
      </div>
    </Layout>
  );
}

export default App;
