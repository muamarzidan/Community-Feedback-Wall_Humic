import { useState } from 'react';

import { getCurrentUser } from '@/utils/auth/getCurrentUser.js';
import { listNotesAPI } from '@/lib/api.js';


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
        response = await listNotesAPI.getFilteredNotes(params);
      } else {
        response = await listNotesAPI.getAllNotes();
      }
      
      if (response.data && response.data.data) {
        const data = response.data.data;
        
        if (data.notes) {
          const transformedNotes = data.notes.map(note => transformNoteFromAPI(note));
          setNotes(transformedNotes);
          setPagination(data.pagination);
          setFilterInfo(data.filter);
        } else if (Array.isArray(data)) {
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
      likes: Object.values(apiNote.reactions || {}).reduce((sum, val) => sum + val, 0),
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
  const updateLocalReaction = (noteId, reactionData) => {
    setNotes(prevNotes => prevNotes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          reactions: {
            heart: reactionData.reactions?.heart || 0,
            like: reactionData.reactions?.like || 0,
            laugh: reactionData.reactions?.laugh || 0,
            surprised: reactionData.reactions?.surprised || 0,
            fire: reactionData.reactions?.fire || 0,
          },
          userReactions: reactionData.user_reactions || [],
        };
      };
      return note;
    }));
  };

  return {
    notes,
    pagination,
    filterInfo,
    loading,
    error,
    fetchNotes,
    updateLocalReaction,
    isAuthenticated,
  };
};