import { useState, useEffect } from 'react';

import { getCurrentUser } from '../utils/getCurrentUser.js';
import { notesAPI } from '../lib/api.js';

const GUEST_STORAGE_KEY = 'guest-note-timestamp';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
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
      const response = await notesAPI.getAllNotes();
      
      if (response.data && response.data.data) {
        // Transform API data to match frontend format
        const transformedNotes = response.data.data.map((note, index) => 
          transformNoteFromAPI(note, index)
        );
        setNotes(transformedNotes);
      };
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err.message || 'Failed to fetch notes');
      setNotes([]);
    } finally {
      setLoading(false);
    };
  };
  // Transform API note to frontend format
  const transformNoteFromAPI = (apiNote, index) => {
    const currentUser = getCurrentUser();
    const position = calculatePosition(index, notes.length);
    
    // Determine user type
    let userType = 'people'; // Default for other users
    if (apiNote.user) {
      if (currentUser && apiNote.user.id === currentUser.id) {
        userType = 'you';
      };
    } else {
      // No user means it's a guest note
      userType = 'guest';
    };

    return {
      id: apiNote.id,
      title: apiNote.title,
      description: apiNote.description,
      content: apiNote.description,
      backgroundColor: apiNote.color ? `#${apiNote.color}` : '#fef3c7',
      author: apiNote.user ? apiNote.user.name : 'Guest',
      userId: apiNote.user ? apiNote.user.id : null,
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
      // Check if guest and can create note
      if (!isAuthenticated() && !canGuestCreateNote()) {
        throw new Error('Guest can only create 1 note per day');
      };

      // Prepare data for API
      const apiData = {
        title: noteData.title,
        description: noteData.description,
        color: noteData.backgroundColor?.replace('#', '') || 'fef3c7',
      };

      // Only add image if user is authenticated
      if (isAuthenticated() && noteData.image) {
        apiData.image = noteData.image;
      };

      const response = await notesAPI.createNote(apiData);
      if (response.data && response.data.data) {
        // Update guest timestamp if not authenticated
        if (!isAuthenticated()) {
          localStorage.setItem(GUEST_STORAGE_KEY, Date.now().toString());
        };

        // Refresh notes list
        await fetchNotes();
        return response.data.data;
      };
    } catch (err) {
      console.error('Error creating note:', err);
      throw err;
    };
  };
  const updateNote = async (noteId, noteData) => {
    try {
      // Only authenticated users can edit
      if (!isAuthenticated()) {
        throw new Error('Only logged in users can edit notes');
      };

      const apiData = {
        title: noteData.title,
        description: noteData.description,
        color: noteData.backgroundColor?.replace('#', '') || 'fef3c7',
      };

      // Handle image update
      if (noteData.image instanceof File) {
        apiData.image = noteData.image;
      };
      if (noteData.delete_image) {
        apiData.delete_image = noteData.delete_image;
      };

      const response = await notesAPI.updateNote(noteId, apiData);
      if (response.data) {
        await fetchNotes();
        return response.data.data;
      };
    } catch (err) {
      console.error('Error updating note:', err);
      throw err;
    };
  };
  const deleteNote = async (noteId) => {
    try {
      // Only authenticated users can delete
      if (!isAuthenticated()) {
        throw new Error('Only logged in users can delete notes');
      };

      await notesAPI.deleteNote(noteId);
      
      await fetchNotes();
    } catch (err) {
      console.error('Error deleting note:', err);
      throw err;
    };
  };
  const updateReaction = async (noteId, reactionType) => {
    try {
      // Only authenticated users can react
      if (!isAuthenticated()) {
        throw new Error('Only logged in users can react to notes');
      };

      // Map frontend reaction types to API reaction types
      const reactionMap = {
        heart: 'heart',
        like: 'like',
        laugh: 'laugh',
        surprised: 'surprised',
        fire: 'fire',
      };

      const apiReactionType = reactionMap[reactionType];
      const response = await notesAPI.toggleReaction(noteId, apiReactionType);
      
      if (response.data && response.data.data) {
        // Update local state optimistically
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
          };
          return note;
        }));
      };
    } catch (err) {
      console.error('Error updating reaction:', err);
    };
  };

  return {
    notes,
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

const calculatePosition = (index, totalNotes) => {
  const cardWidth = 355;
  const cardHeight = 180;
  const spacing = 40;
  const cols = 4;
  
  const col = index % cols;
  const row = Math.floor(index / cols);
  
  return {
    x: 120 + col * (cardWidth + spacing),
    y: 80 + row * (cardHeight + spacing),
  };
};