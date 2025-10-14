import { useState, useEffect } from 'react';

const STORAGE_KEY = 'notes-canvas-data';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Error parsing saved notes:', error);
        initializeDefaultNotes();
      }
    } else {
      initializeDefaultNotes();
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes]);

  const initializeDefaultNotes = () => {
    const defaultNotes = generateDefaultNotes();
    setNotes(defaultNotes);
  };

  const addNote = (noteData) => {
    const position = findAvailablePosition(notes);
    const newNote = {
      ...noteData,
      x: position.x,
      y: position.y
    };
    // Add new note at the beginning so it appears on page 1
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (noteId, noteData) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, ...noteData, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const clearAllNotes = () => {
    setNotes([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    clearAllNotes
  };
};

// Generate 15 default notes
const generateDefaultNotes = () => {
  const titles = [
    'Meeting Notes', 'Project Ideas', 'Shopping List', 'Book Recommendations', 
    'Travel Plans', 'Recipe Collection', 'Workout Routine', 'Learning Goals',
    'Budget Planning', 'Gift Ideas', 'Home Improvements', 'Code Snippets',
    'Blog Topics', 'Contact Info', 'Daily Reminders'
  ];

  const descriptions = [
    'Important points from today\'s team meeting and action items to follow up.',
    'Creative project ideas for the next quarter. Need to prioritize and plan.',
    'Grocery items needed for this week. Don\'t forget organic vegetables.',
    'List of books recommended by colleagues and friends to read.',
    'Vacation planning for summer trip. Research destinations and activities.',
    'Collection of favorite recipes and new ones to try cooking.',
    'Weekly workout schedule and fitness goals to maintain health.',
    'Skills and topics I want to learn this year. Set timeline and resources.',
    'Monthly budget breakdown and savings goals for financial planning.',
    'Birthday and holiday gift ideas for family and friends.',
    'Home renovation projects and improvements planned for this year.',
    'Useful code snippets and programming solutions for reference.',
    'Blog post ideas and topics to write about. Content calendar planning.',
    'Important contact information and networking connections.',
    'Daily tasks and reminders to stay organized and productive.'
  ];

  const colors = ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#fb923c'];

  return titles.map((title, index) => {
    const position = calculatePosition(index);
    return {
      id: Date.now() + index,
      title,
      description: descriptions[index],
      backgroundColor: colors[index % colors.length],
      author: 'ARYA JAGADDITHA',
      x: position.x,
      y: position.y,
      createdAt: new Date(Date.now() - (index * 86400000)).toISOString(), // Spread over days
      updatedAt: new Date(Date.now() - (index * 86400000)).toISOString()
    };
  });
};

// Calculate position for notes to avoid overlap
const calculatePosition = (index) => {
  const cardWidth = 200;
  const cardHeight = 150;
  const spacing = 50;
  const cols = 4;
  
  const col = index % cols;
  const row = Math.floor(index / cols);
  
  return {
    x: 100 + col * (cardWidth + spacing),
    y: 100 + row * (cardHeight + spacing)
  };
};

// Find available position for new note
const findAvailablePosition = (existingNotes) => {
  const cardWidth = 200;
  const cardHeight = 150;
  const spacing = 50;
  const minDistance = 50;

  // Start from a default position
  let x = 100;
  let y = 100;
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    let hasOverlap = false;

    // Check if this position overlaps with any existing note
    for (const note of existingNotes) {
      const distance = Math.sqrt(
        Math.pow(x - note.x, 2) + Math.pow(y - note.y, 2)
      );
      
      if (distance < minDistance + cardWidth) {
        hasOverlap = true;
        break;
      }
    }

    if (!hasOverlap) {
      return { x, y };
    }

    // Try next position
    x += cardWidth + spacing;
    if (x > window.innerWidth - cardWidth - 100) {
      x = 100;
      y += cardHeight + spacing;
    }

    attempts++;
  }

  // If no available position found, place randomly
  return {
    x: Math.random() * (window.innerWidth - cardWidth - 200) + 100,
    y: Math.random() * (window.innerHeight - cardHeight - 200) + 100
  };
};