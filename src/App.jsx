import { useState, useEffect } from 'react';

import { useCursorMode } from './contexts/CursorModeContext';
import { useCanvasNotes } from './hooks/useCanvasNotes';
import { closeAllMenus } from './utils/domUtils';
import Layout from './components/common/Layout';
import NotesCanvas from './components/notes/NotesCanvas';
import CreateNoteButton from './components/notes/CreateNoteButton';
import CursorModeToggle from './components/notes/CursorModeToggle';
import ZoomControls from './components/notes/ZoomControl';
import Pagination from './components/Pagination';
import NoteModal from './components/notes/NoteModal';
import GuestWarningModal from './components/auth/GuestWarningModal';
import ImageViewer from './components/notes/ImageViewer';
import Toast from './components/common/Toast';
import DeleteConfirmModal from './components/notes/DeleteConfirmModalNote';
import './App.css';


function App() {
  const { 
    notes, 
    currentCanvasId,
    navigation,
    addNote, 
    updateNote, 
    deleteNote, 
    updateReaction, 
    loading, 
    isAuthenticated, 
    canGuestCreateNote,
    goToCanvas,
    goToPreviousCanvas,
    goToNextCanvas,
    goToCurrentActiveCanvas
  } = useCanvasNotes();
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
  const [toast, setToast] = useState({
    isOpen: false,
    message: '',
    type: 'success'
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    noteId: null,
    noteTitle: ''
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
        setToast({
          isOpen: true,
          message: 'Note updated successfully!',
          type: 'success'
        });
      } else {
        if (!isAuthenticated() && !canGuestCreateNote()) {
          alert('Guest users can only create 1 note per day. Please login to create more notes.');
          return;
        };
        
        await addNote(noteData);
        setToast({
          isOpen: true,
          message: 'Note created successfully!',
          type: 'success'
        });
      };
      
      setModalState({
        isOpen: false,
        editingNote: null
      });
    } catch (error) {
      console.error('Error saving note:', error);
      setToast({
        isOpen: true,
        message: error.message || 'Failed to save note',
        type: 'error'
      });
    };
  };
  const handleDeleteNote = async (noteId) => {
    if (!isAuthenticated()) {
      alert('Only logged in users can delete notes.');
      return;
    };
    
    const noteToDelete = notes.find(n => n.id === noteId);
    
    setDeleteConfirm({
      isOpen: true,
      noteId: noteId,
      noteTitle: noteToDelete?.title || ''
    });
  };
  const confirmDelete = async () => {
    try {
      await deleteNote(deleteConfirm.noteId);
      setToast({
        isOpen: true,
        message: 'Note deleted successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      setToast({
        isOpen: true,
        message: 'Failed to delete note',
        type: 'error'
      });
    }
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
            notes={notes}
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
        <div className="absolute z-50 flex justify-center w-full transform -translate-x-1/2 bottom-20 sm:bottom-6 left-1/2">
          <Pagination
            currentCanvasId={currentCanvasId}
            navigation={navigation}
            onCanvasChange={goToCanvas}
            onPrevious={goToPreviousCanvas}
            onNext={goToNextCanvas}
            onGoToCurrent={goToCurrentActiveCanvas}
          />
        </div>
        {/* Cursor Mode */}
        <div className="absolute z-50 flex flex-col gap-3 right-4 top-4 sm:right-32 sm:top-6">
          <CursorModeToggle 
            cursorMode={cursorMode}
            onModeChange={(newMode) => {
              closeAllMenus();
              setCursorMode(newMode);
            }}
          />
        </div>
        {/* Zoom Control */}
        <div className="absolute z-50 right-4 bottom-54 sm:bottom-24 sm:right-32">
          <ZoomControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
        </div>
        {/* Create Note */}
        <div className="absolute z-50 flex flex-col gap-3 right-5 bottom-40 sm:bottom-6 sm:right-32">
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
        {/* Toast Notification */}
        <Toast
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ isOpen: false, message: '', type: 'success' })}
        />
        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={deleteConfirm.isOpen}
          noteTitle={deleteConfirm.noteTitle}
          onClose={() => setDeleteConfirm({ isOpen: false, noteId: null, noteTitle: '' })}
          onConfirm={confirmDelete}
        />
    </Layout>
  );
};

export default App;