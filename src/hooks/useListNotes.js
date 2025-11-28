import { useState } from 'react';

import { getCurrentUser } from '../utils/getCurrentUser.js';
import { listNotesAPI } from '../lib/api.js';


export const useListNotes = () => {
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filterInfo, setFilterInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const isAuthenticated = () => {
    return !!localStorage.getItem('token_community-feedback');
  };
  const fetchNotes = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (params.filter || params.from_date || params.to_date) {
        // Use filtered endpoint
        response = await listNotesAPI.getFilteredNotes(params);
      } else {
        // Use simple get all
        response = await listNotesAPI.getAllNotes();
      }
      
      if (response.data && response.data.data) {
        const data = response.data.data;
        
        // Check if it's filtered response or simple response
        if (data.notes) {
          // Filtered response
          const transformedNotes = data.notes.map(note => transformNoteFromAPI(note));
          setNotes(transformedNotes);
          setPagination(data.pagination);
          setFilterInfo(data.filter);
        } else if (Array.isArray(data)) {
          // Simple response (array of notes)
          const transformedNotes = data.map(note => transformNoteFromAPI(note));
          setNotes(transformedNotes);
          setPagination(null);
          setFilterInfo(null);
        }
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError(err.message || 'Failed to fetch notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };
  const transformNoteFromAPI = (apiNote) => {
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
      // Could show email: Guest (email@example.com)
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
      likes: Object.values(apiNote.reactions || {}).reduce((sum, val) => sum + val, 0), // Total reactions
      reactions: {
        heart: apiNote.reactions?.heart || 0,
        like: apiNote.reactions?.like || 0,
        laugh: apiNote.reactions?.laugh || 0,
        surprised: apiNote.reactions?.surprised || 0,
        fire: apiNote.reactions?.fire || 0,
      },
      userReactions: apiNote.user_reactions || [],
      canvasInfo: apiNote.canvas || null,
      createdAt: apiNote.created_at,
      updatedAt: apiNote.updated_at,
    };
  };

  return {
    notes,
    pagination,
    filterInfo,
    loading,
    error,
    fetchNotes,
    isAuthenticated,
  };
};