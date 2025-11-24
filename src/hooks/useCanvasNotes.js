import { useState, useEffect } from 'react';

import { getCurrentUser } from '../utils/getCurrentUser.js';
import { canvasNotesAPI } from '../services/api';


const GUEST_STORAGE_KEY = 'guest-note-timestamp';
const CANVAS_ID = 1;

export const useCanvasNotes = () => {
  const [notes, setNotes] = useState([]);
  const [canvasInfo, setCanvasInfo] = useState(null);
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
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await canvasNotesAPI.getCanvasNotes(CANVAS_ID);
      if (response.data && response.data.data) {
        const apiNotes = response.data.data.notes || [];
        const canvasCount = response.data.data.canvas_count || response.data.data.canvases?.[0]?.current_count;
        const grid = response.data.data.grid;
        
        setCanvasInfo({
          canvasId: CANVAS_ID,
          canvasCount: canvasCount,
          grid: grid
        });
        
        // Transform API data dengan grid positioning
        const transformedNotes = apiNotes.map((note, index) => 
          transformNoteFromAPI(note, index)
        );
        setNotes(transformedNotes);
      }
    } catch (err) {
      console.error('Error fetching canvas notes:', err);
      setError(err.message || 'Failed to fetch notes');
      setNotes([]);
    } finally {
      setLoading(false);
    };
  };
  const transformNoteFromAPI = (apiNote, index = 0) => {
    const currentUser = getCurrentUser();
    
    // Determine user type
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

    // Convert grid position to pixel coordinates
    // If grid_position exists, use it. Otherwise, calculate from index
    const position = apiNote.grid_position 
      ? gridToPixelPosition(apiNote.grid_position)
      : calculatePositionFromIndex(index);

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
        thumbsUp: apiNote.reactions?.like || 0,
        laugh: apiNote.reactions?.laugh || 0,
        surprised: apiNote.reactions?.surprised || 0,
        fire: apiNote.reactions?.fire || 0,
      },
      userReactions: apiNote.user_reactions || [],
      gridPosition: apiNote.grid_position || null,
      x: position.x,
      y: position.y,
      createdAt: apiNote.created_at,
      updatedAt: apiNote.updated_at,
    };
  };
  // Convert grid position (row, col) to pixel coordinates
  const gridToPixelPosition = (gridPos) => {
    const cardWidth = 355; // Base width
    const cardHeight = 180; // Base height
    const spacing = 40;
    const startX = 120;
    const startY = 80;
    
    return {
      x: startX + (gridPos.col * (cardWidth + spacing)),
      y: startY + (gridPos.row * (cardHeight + spacing)),
    };
  };
  // Fallback: Calculate position from index when grid_position not available
  const calculatePositionFromIndex = (index) => {
    const cardWidth = 355;
    const cardHeight = 200;
    const spacing = 40;
    const cols = 4; // Default 4 columns
    const startX = 120;
    const startY = 80;
    
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    return {
      x: startX + (col * (cardWidth + spacing)),
      y: startY + (row * (cardHeight + spacing)),
    };
  };
  const addNote = async (noteData) => {
    try {
      // Check guest limitations
      if (!isAuthenticated()) {
        if (!canGuestCreateNote()) {
          throw new Error('Guest can only create 1 note per day');
        };
        // Email wajib untuk guest
        if (!noteData.email) {
          throw new Error('Email is required for guest users');
        };
        // Guest tidak bisa upload image
        if (noteData.image) {
          throw new Error('Guest users cannot upload images');
        };
      };

      const apiData = {
        title: noteData.title,
        description: noteData.description,
        color: noteData.backgroundColor?.replace('#', '') || 'fef3c7',
      };

      // Add email for guest
      if (!isAuthenticated() && noteData.email) {
        apiData.email = noteData.email;
      };
      // Add image for authenticated users only
      if (isAuthenticated() && noteData.image) {
        apiData.image = noteData.image;
      };

      const response = await canvasNotesAPI.createNote(apiData);
      if (response.data) {
        // Update guest timestamp
        if (!isAuthenticated()) {
          localStorage.setItem(GUEST_STORAGE_KEY, Date.now().toString());
        };

        await fetchNotes();
        return response.data.data;
      };
    } catch (err) {
      console.error('Error creating note:', err);
      throw err;
    }
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
      };

      if (noteData.image instanceof File) {
        apiData.image = noteData.image;
      };
      if (noteData.delete_image) {
        apiData.delete_image = noteData.delete_image;
      };

      const response = await canvasNotesAPI.updateNote(noteId, apiData);
      if (response.data) {
        await fetchNotes();
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
      await fetchNotes();
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
        thumbsUp: 'like',
        laugh: 'laugh',
        surprised: 'surprised',
        fire: 'fire',
      };

      const apiReactionType = reactionMap[reactionType];
      const response = await canvasNotesAPI.toggleReaction(noteId, apiReactionType);
      if (response.data && response.data.data) {
        // Update local state
        setNotes(prevNotes => prevNotes.map(note => {
          if (note.id === noteId) {
            return {
              ...note,
              reactions: {
                heart: response.data.data.reactions.heart || 0,
                thumbsUp: response.data.data.reactions.like || 0,
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

  return {
    notes,
    canvasInfo,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    updateReaction,
    refreshNotes: fetchNotes,
    canGuestCreateNote,
    isAuthenticated,
  };
};