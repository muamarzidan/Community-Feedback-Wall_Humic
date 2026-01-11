import { useState, useEffect } from 'react';

import { getCurrentUser } from '@/utils/auth/getCurrentUser.js';
import { canvasNotesAPI } from '@/lib/api.js';


const GUEST_STORAGE_KEY = 'guest-note-timestamp_community-feedback';

export const useCanvasNotes = () => {
  const [notes, setNotes] = useState([]);
  const [canvasInfo, setCanvasInfo] = useState(null);
  const [currentCanvasId, setCurrentCanvasId] = useState(null);
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

      const response = await canvasNotesAPI.getCurrentCanvasNotes();
      if (response.data && response.data.data) {
        const data = response.data.data;
        const apiNotes = data.notes || [];
        
        setCurrentCanvasId(data.canvas_id);
        setCanvasInfo({
          canvasId: data.canvas_id,
          positioning: data.positioning,
        });
        
        const transformedNotes = apiNotes.map((note, index) => 
          transformNoteFromAPI(note, index)
        );
        setNotes(transformedNotes);
        
        fetchCanvasInfo(data.canvas_id);
      }
    } catch (err) {
      console.error('Error fetching current canvas:', err);
      setError(err.message || 'Failed to fetch notes');
      setNotes([]);
    } finally {
      setLoading(false);
    };
  };
  const fetchCanvasInfo = async (canvasId) => {
    try {
      const response = await canvasNotesAPI.getCanvasById(canvasId);
      if (response.data && response.data.data) {
        const data = response.data.data;
        setNavigation(data.navigation);
        setCanvasInfo(prev => ({
          ...prev,
          notesCount: data.notes_count,
          currentCount: data.current_count,
          isFull: data.is_full,
          remainingSlots: data.remaining_slots,
          isCurrentActive: data.is_current_active,
        }));
      }
    } catch (err) {
      console.error('Error fetching canvas info:', err);
    }
  };
  const fetchCanvasByID = async (canvasId) => {
    try {
      setLoading(true);
      setError(null);

      const notesResponse = await canvasNotesAPI.getCanvasNotesByID(canvasId);
      if (notesResponse.data && notesResponse.data.data) {
        const data = notesResponse.data.data;
        const apiNotes = data.notes || [];
        
        setCurrentCanvasId(data.canvas_id);
        setCanvasInfo({
          canvasId: data.canvas_id,
          canvasCount: data.canvas_count,
        });
        
        const transformedNotes = apiNotes.map((note, index) => 
          transformNoteFromAPI(note, index)
        );
        setNotes(transformedNotes);
        
        fetchCanvasInfo(canvasId);
      }
    } catch (err) {
      console.error('Error fetching canvas by ID:', err);
      setError(err.message || 'Failed to fetch canvas');
      setNotes([]);
    } finally {
      setLoading(false);
    };
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
        if (currentCanvasId) {
          await fetchCanvasByID(currentCanvasId);
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
      
      if (currentCanvasId) {
        await fetchCanvasByID(currentCanvasId);
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
  const goToCanvas = (canvasId) => {
    fetchCanvasByID(canvasId);
  };
  const goToPreviousCanvas = () => {
    if (navigation?.previous_canvas) {
      fetchCanvasByID(navigation.previous_canvas.id);
    }
  };
  const goToNextCanvas = () => {
    if (navigation?.next_canvas) {
      fetchCanvasByID(navigation.next_canvas.id);
    }
  };
  const goToCurrentActiveCanvas = () => {
    if (navigation?.current_active_canvas) {
      fetchCanvasByID(navigation.current_active_canvas.id);
    } else {
      fetchCurrentCanvas();
    }
  };

  return {
    notes,
    canvasInfo,
    currentCanvasId,
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