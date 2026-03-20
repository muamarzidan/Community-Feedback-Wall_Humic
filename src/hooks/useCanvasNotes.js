import { useState, useEffect } from 'react';

import { getCurrentUser } from '@/utils/auth/getCurrentUser.js';
import { canvasNotesAPI } from '@/lib/api.js';


const GUEST_STORAGE_KEY = 'guest-note-timestamp_community-feedback';

export const useCanvasNotes = () => {
  const [notes, setNotes] = useState([]);
  const [canvasInfo, setCanvasInfo] = useState(null);
  const [currentCanvasId, setCurrentCanvasId] = useState(null);
  const [currentCanvasPage, setCurrentCanvasPage] = useState(null);
  const [totalCanvases, setTotalCanvases] = useState(0);
  const [navigation, setNavigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const isAuthenticated = () => {
    return !!localStorage.getItem('token_community-feedback');
  };
  const canGuestCreateNote = () => {
    const lastNoteTimestamp = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!lastNoteTimestamp) return true;
    
    const lastNoteDate = new Date(parseInt(lastNoteTimestamp));
    const now = new Date();
    const daysDiff = Math.floor((now - lastNoteDate) / (1000 * 60 * 60 * 24));
    
    return daysDiff >= 1;
  };

  useEffect(() => {
    fetchCurrentCanvas();
  }, []);

  const fetchCurrentCanvas = async () => {
    try {
      setLoading(true);
      setError(null);

      // Resolve active canvas page from page-based endpoint, then load that page.
      const firstPageResponse = await canvasNotesAPI.getCanvasByPage(1);
      const firstPageData = firstPageResponse?.data?.data;
      if (!firstPageData) {
        setNotes([]);
        return;
      }

      const activePage = firstPageData?.navigation?.current_active_canvas?.page || 1;
      await fetchCanvasByPage(activePage);
    } catch (err) {
      console.error('Error fetching current canvas:', err);
      setError(err.message || 'Failed to fetch notes');
      setNotes([]);
    } finally {
      setLoading(false);
    };
  };
  const fetchCanvasByPage = async (page) => {
    try {
      const response = await canvasNotesAPI.getCanvasByPage(page);
      const data = response?.data?.data;
      if (!data || !data.canvas) {
        setNotes([]);
        return;
      }

      const canvasId = data.canvas.id;
      setCurrentCanvasId(canvasId);
      setCurrentCanvasPage(data.page);
      setTotalCanvases(data.total_canvases || 0);
      setNavigation(data.navigation || null);

      setCanvasInfo({
        canvasId: canvasId,
        page: data.page,
        totalCanvases: data.total_canvases || 0,
        notesCount: data.canvas.notes_count,
        currentCount: data.canvas.current_count,
        isFull: data.canvas.is_full,
        remainingSlots: data.canvas.remaining_slots,
        isCurrentActive: data.canvas.is_current_active,
      });

      const notesResponse = await canvasNotesAPI.getCanvasNotesByID(canvasId);
      const notesData = notesResponse?.data?.data;
      const apiNotes = notesData?.notes || [];

      const transformedNotes = apiNotes.map((note, index) =>
        transformNoteFromAPI(note, index)
      );
      setNotes(transformedNotes);
    } catch (err) {
      console.error('Error fetching canvas by page:', err);
      setError(err.message || 'Failed to fetch canvas');
      setNotes([]);
    }
  };
  const transformNoteFromAPI = (apiNote, index = 0) => {
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
    } else if (apiNote.guest) {
      userType = 'guest';
      authorName = 'Guest';
    };

    const position = {
      x: parseFloat(apiNote.x || 0),
      y: parseFloat(apiNote.y || 0)
    };

    return {
      id: apiNote.id,
      title: apiNote.title,
      description: apiNote.description,
      content: apiNote.description,
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
      x: position.x,
      y: position.y,
      height: Number(apiNote.height) || 0,
      createdAt: apiNote.created_at,
      updatedAt: apiNote.updated_at,
    };
  };
  const addNote = async (noteData) => {
    try {
      if (!isAuthenticated()) {
        if (!canGuestCreateNote()) {
          throw new Error('Guest can only create 1 note per day');
        };
        if (!noteData.email) {
          throw new Error('Email is required for guest users');
        };
        if (noteData.image) {
          throw new Error('Guest users cannot upload images');
        };
      };

      const apiData = {
        title: noteData.title,
        description: noteData.description,
        color: noteData.backgroundColor?.replace('#', '') || 'fef3c7',
        height: noteData.height || 0,
      };
      
      console.log('SENDING NOTE TO BACKEND:', {
        title: apiData.title,
        height: apiData.height,
        hasImage: !!(isAuthenticated() && noteData.image),
        timestamp: new Date().toISOString()
      });
      
      if (!isAuthenticated() && noteData.email) {
        apiData.email = noteData.email;
      };
      if (isAuthenticated() && noteData.image) {
        apiData.image = noteData.image;
      };

      const response = await canvasNotesAPI.createNote(apiData);
      if (response.data) {
        if (!isAuthenticated()) {
          localStorage.setItem(GUEST_STORAGE_KEY, Date.now().toString());
        };

        await fetchCurrentCanvas();
        return response.data.data;
      };
    } catch (err) {
      console.error('Error creating note:', err);
      throw err;
    };
  };
  const updateNote = async (noteId, noteData) => {
    try {
      if (!isAuthenticated()) {
        throw new Error('Only logged in users can edit notes');
      };

      const apiData = {
        title: noteData.title,
        description: noteData.description,
        color: noteData.backgroundColor?.replace('#', '') || 'fef3c7',
        height: noteData.height || 0,
      };
      
      console.log('UPDATING NOTE TO BACKEND:', {
        noteId: noteId,
        title: apiData.title,
        height: apiData.height,
        hasNewImage: noteData.image instanceof File,
        timestamp: new Date().toISOString()
      });

      if (noteData.image instanceof File) {
        apiData.image = noteData.image;
      };
      if (noteData.delete_image) {
        apiData.delete_image = noteData.delete_image;
      };

      const response = await canvasNotesAPI.updateNote(noteId, apiData);
      if (response.data) {
        if (currentCanvasPage) {
          await fetchCanvasByPage(currentCanvasPage);
        } else {
          await fetchCurrentCanvas();
        }
        return response.data.data;
      };
    } catch (err) {
      console.error('Error updating note:', err);
      throw err;
    }
  };
  const deleteNote = async (noteId) => {
    try {
      if (!isAuthenticated()) {
        throw new Error('Only logged in users can delete notes');
      };

      await canvasNotesAPI.deleteNote(noteId);
      
      if (currentCanvasPage) {
        await fetchCanvasByPage(currentCanvasPage);
      } else {
        await fetchCurrentCanvas();
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      throw err;
    };
  };
  const updateReaction = async (noteId, reactionType) => {
    try {
      if (!isAuthenticated()) {
        throw new Error('Please login to react to notes');
      };

      const reactionMap = {
        heart: 'heart',
        like: 'like',
        laugh: 'laugh',
        surprised: 'surprised',
        fire: 'fire',
      };

      const apiReactionType = reactionMap[reactionType];
      const response = await canvasNotesAPI.toggleReaction(noteId, apiReactionType);
      if (response.data && response.data.data) {
        setNotes(prevNotes => prevNotes.map(note => {
          if (note.id === noteId) {
            return {
              ...note,
              reactions: {
                heart: response.data.data.reactions.heart || 0,
                like: response.data.data.reactions.like || 0,
                laugh: response.data.data.reactions.laugh || 0,
                surprised: response.data.data.reactions.surprised || 0,
                fire: response.data.data.reactions.fire || 0,
              },
              userReactions: response.data.data.user_reactions || [],
            };
          }
          return note;
        }));
      }
    } catch (err) {
      console.error('Error updating reaction:', err);
      throw err;
    };
  };
  const goToCanvas = (page) => {
    fetchCanvasByPage(page);
  };
  const goToPreviousCanvas = () => {
    if (navigation?.previous_page) {
      fetchCanvasByPage(navigation.previous_page);
    }
  };
  const goToNextCanvas = () => {
    if (navigation?.next_page) {
      fetchCanvasByPage(navigation.next_page);
    }
  };
  const goToCurrentActiveCanvas = () => {
    if (navigation?.current_active_canvas?.page) {
      fetchCanvasByPage(navigation.current_active_canvas.page);
    } else {
      fetchCurrentCanvas();
    }
  };

  return {
    notes,
    canvasInfo,
    currentCanvasId,
    currentCanvasPage,
    totalCanvases,
    navigation,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    updateReaction,
    refreshNotes: fetchCurrentCanvas,
    goToCanvas,
    goToPreviousCanvas,
    goToNextCanvas,
    goToCurrentActiveCanvas,
    canGuestCreateNote,
    isAuthenticated,
  };
};