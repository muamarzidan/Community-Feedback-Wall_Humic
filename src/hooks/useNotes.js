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
    setNotes(notes => notes.filter(note => note.id !== noteId));
  };

  const clearAllNotes = () => {
    setNotes([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateReaction = (noteId, reactionType) => {
    setNotes(notes => notes.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          reactions: {
            ...note.reactions,
            [reactionType]: (note.reactions[reactionType] || 0) + 1
          }
        };
      }
      return note;
    }));
  };

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    clearAllNotes,
    updateReaction
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
    'Important points from today\'s team meeting and action items to follow up. Important points from today\'s team meeting and action items to follow up. Important points from today\'s team meeting and action items to follow up. Important points from today\'s team meeting and action items to follow up. Important points from today\'s team meeting and action items to follow up. Important points from today\'s team meeting and action items to follow up. Important points from today\'s team meeting and action items to follow up. Important points from today\'s team meeting and action items to follow up. Important points from today\'s team meeting and action items to follow up. .Important points from today\'s team meeting and action items to follow up . c',
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

  const colors = ['#fef3c7', '#fecdd3', '#d9f99d', '#bfdbfe', '#ddd6fe', '#fed7aa'];
  
  // Sample images from unsplash
  const images = [
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=200&fit=crop',
    null,
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop',
    null,
    'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400&h=200&fit=crop',
    null,
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=200&fit=crop',
    null,
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop',
    null,
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=200&fit=crop',
    null,
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=200&fit=crop',
    null,
    null
  ];

  const authors = [
    'Difa rindang utari', 'Arya Jagadditha', 'Budi Santoso', 'Siti Nurhaliza',
    'Rizky Pratama', 'Maya Anggraini', 'Andi Wijaya', 'Dewi Lestari'
  ];

  // User types: 'guest', 'you', 'people'
  const userTypes = ['guest', 'people', 'you', 'people'];
  const currentUserId = 'current-user-123'; // This would come from auth context
  const currentUserName = 'Punya saya';

  return titles.map((title, index) => {
    const position = calculatePosition(index);
    const dayOffset = Math.floor(Math.random() * 30); // Random days within last month
    const createdDate = new Date(Date.now() - (dayOffset * 86400000));
    const userType = userTypes[index % userTypes.length];
    
    // Determine if note has image based on user type
    let hasImage = false;
    let authorName = authors[index % authors.length];
    let userId = `user-${index}`;
    
    if (userType === 'you') {
      // My notes - can have images, show edit/delete buttons
      hasImage = Math.random() > 0.3; // 70% chance of having image
      // authorName = currentUserName;
      userId = currentUserId;
    } else if (userType === 'people') {
      // Other logged in users - can have images
      hasImage = Math.random() > 0.4; // 60% chance of having image
    } else {
      // Guest users - no images
      hasImage = false;
      authorName = authorName + ' (orang lain)';
    }
    
    return {
      id: Date.now() + index,
      title,
      description: descriptions[index],
      content: descriptions[index], // For search functionality
      backgroundColor: colors[index % colors.length],
      author: authorName,
      userId: userId,
      userType: userType, // 'guest', 'you', 'people'
      image: hasImage ? images[index] : null,
      likes: Math.floor(Math.random() * 50) + 1, // For sorting by likes
      reactions: {
        heart: Math.floor(Math.random() * 10) + 1,
        thumbsUp: Math.floor(Math.random() * 10) + 1,
        star: Math.floor(Math.random() * 10) + 1,
        smile: Math.floor(Math.random() * 10) + 1,
        fire: Math.floor(Math.random() * 10) + 1
      },
      x: position.x,
      y: position.y,
      createdAt: createdDate.toISOString(),
      updatedAt: createdDate.toISOString()
    };
  });
};

// Calculate position for notes to avoid overlap
const calculatePosition = (index) => {
  const cardWidth = 300; // Updated for new design
  const cardHeight = 320; // Updated for new design
  const spacing = 40;
  const cols = 3; // Fewer columns due to larger cards
  
  const col = index % cols;
  const row = Math.floor(index / cols);
  
  return {
    x: 120 + col * (cardWidth + spacing),
    y: 80 + row * (cardHeight + spacing)
  };
};

// Find available position for new note
const findAvailablePosition = (existingNotes) => {
  const cardWidth = 300;
  const cardHeight = 320;
  const spacing = 40;
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