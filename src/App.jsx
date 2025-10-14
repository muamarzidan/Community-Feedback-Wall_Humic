import { useState, useEffect } from 'react';
import Header from './components/Header';
import NotesCanvas from './components/NotesCanvas';
import CreateNoteButton from './components/CreateNoteButton';
import CursorModeToggle from './components/CursorModeToggle';
import ZoomControls from './components/ZoomControls';
import Pagination from './components/Pagination';
import NoteModal from './components/NoteModal';
import { useNotes } from './hooks/useNotes';
import { usePagination } from './hooks/usePagination';
import './App.css';

function App() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { currentPage, totalPages, paginatedItems, goToPage, resetToFirstPage } = usePagination(notes, 5);
  
  const [zoom, setZoom] = useState(1);
  const [cursorMode, setCursorMode] = useState('drag'); // 'default' or 'drag'
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const [modalState, setModalState] = useState({
    isOpen: false,
    editingNote: null
  });

  // Handle window resize
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
      // Close any open menus
      const menuElement = document.querySelector('.fixed.z-50');
      if (menuElement) {
        document.body.removeChild(menuElement);
      }
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-50 relative">
      <Header />
      
      <NotesCanvas
        notes={paginatedItems}
        zoom={zoom}
        cursorMode={cursorMode}
        width={dimensions.width}
        height={dimensions.height}
        onNoteEdit={handleEditNote}
        onNoteDelete={handleDeleteNote}
        onStageClick={handleStageClick}
      />
      
      <CreateNoteButton onClick={handleCreateNote} />
      
      <CursorModeToggle 
        cursorMode={cursorMode}
        onModeChange={(newMode) => {
          // Close any open menus when changing cursor mode
          const menuElement = document.querySelector('.fixed.z-50');
          if (menuElement) {
            document.body.removeChild(menuElement);
          }
          setCursorMode(newMode);
        }}
      />
      
      <ZoomControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
      
      <NoteModal
        isOpen={modalState.isOpen}
        note={modalState.editingNote}
        onSave={handleSaveNote}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
