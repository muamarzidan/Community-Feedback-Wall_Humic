import { useRef, useCallback } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { CiMenuKebab } from "react-icons/ci";

// Global menu state to avoid React re-renders affecting the canvas
let activeNoteMenu = null;

const NoteCard = ({ note, onEdit, onDelete, cursorMode = 'drag' }) => {
  const menuRef = useRef(null);

  const openMenu = useCallback((position) => {
    // Close any previously opened menu
    if (activeNoteMenu) {
      document.body.removeChild(activeNoteMenu);
      activeNoteMenu = null;
    }
    
    const menuElement = document.createElement('div');
    menuElement.className = 'fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[80px]';
    menuElement.style.left = `${position.x}px`;
    menuElement.style.top = `${position.y}px`;
    
    const editButton = document.createElement('button');
    editButton.className = 'w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
      setTimeout(() => onEdit(), 10);
    });
    
    const lineDivider = document.createElement('hr');
    lineDivider.className = 'border-gray-200';
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 transition-colors';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMenu();
      setTimeout(() => onDelete(), 10);
    });
    
    // Append all elements
    menuElement.appendChild(editButton);
    menuElement.appendChild(lineDivider);
    menuElement.appendChild(deleteButton);
    
    // Add to DOM
    document.body.appendChild(menuElement);
    activeNoteMenu = menuElement;
    menuRef.current = menuElement;
    
    // Handle click outside
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    
    // Add event listener with a delay
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
  }, [onEdit, onDelete]);
  
  const closeMenu = useCallback(() => {
    if (activeNoteMenu) {
      document.body.removeChild(activeNoteMenu);
      activeNoteMenu = null;
      menuRef.current = null;
      
      // Remove any event listeners
      document.removeEventListener('mousedown', closeMenu);
    }
  }, []);

  const cardWidth = 200;
  const cardHeight = 150;
  const padding = 12;
  const headerHeight = 30;

  const handleMenuClick = (e) => {
    // Only allow settings click in default cursor mode
    if (cursorMode !== 'default') {
      return;
    }

    // Stop event propagation
    e.cancelBubble = true;
    if (e.evt) {
      e.evt.preventDefault();
      e.evt.stopPropagation();
    }

    // Get stage and note position
    const stage = e.target.getStage();
    const stagePosition = stage.position();
    const stageScale = stage.scaleX();

    // Calculate DOM position for menu
    const stageContainer = stage.container();
    const stageRect = stageContainer.getBoundingClientRect();

    // Calculate note position in screen coordinates
    const noteScreenX = stageRect.left + stagePosition.x + (note.x + cardWidth - 5) * stageScale;
    const noteScreenY = stageRect.top + stagePosition.y + note.y * stageScale;

    // Open the menu with the calculated position
    openMenu({
      x: noteScreenX,
      y: noteScreenY + 5,
    });
  };

  return (
    <Group x={note.x} y={note.y}>
      {/* Card Background */}
      <Rect
        width={cardWidth}
        height={cardHeight}
        fill={note.backgroundColor || '#fbbf24'}
        cornerRadius={8}
        shadowColor="rgba(0,0,0,0.1)"
        shadowOffset={{ x: 0, y: 2 }}
        shadowBlur={8}
        onMouseEnter={() => {
          document.body.style.cursor = 'default';
        }}
        onMouseLeave={() => {
          document.body.style.cursor = cursorMode === 'drag' ? 'grab' : 'default';
        }}
      />
      {/* Header Background */}
      <Rect
        y={0}
        width={cardWidth}
        height={headerHeight}
        fill="rgba(0,0,0,0.05)"
        cornerRadius={[8, 8, 0, 0]}
      />
      {/* Title */}
      <Text
        x={padding}
        y={padding / 2}
        text={note.title}
        fontSize={14}
        fontStyle="bold"
        fill="#374151"
        width={cardWidth - 40 - padding}
        ellipsis={true}
      />
      {/* Settings Icon */}
      <Group>
        <Rect
          x={cardWidth - 25}
          y={5}
          width={20}
          height={20}
          fill="transparent"
          cornerRadius={4}
          onClick={handleMenuClick}
          onTap={handleMenuClick}
          listening={cursorMode === 'default'}
        />
        <Text
          x={cardWidth - 22}
          y={8}
          text="⋮"
          fontSize={12}
          onClick={handleMenuClick}
          onTap={handleMenuClick}
          listening={cursorMode === 'default'}
        />
      </Group>
      {/* Description */}
      <Text
        x={padding}
        y={headerHeight + padding / 2}
        text={note.description}
        fontSize={12}
        fill="#6b7280"
        width={cardWidth - (padding * 2)}
        height={cardHeight - headerHeight - 40}
        wrap="word"
      />
      {/* Author */}
      <Text
        x={padding}
        y={cardHeight - 25}
        text={note.author || 'ARYA JAGADDITHA'}
        fontSize={10}
        fill="#9ca3af"
        fontStyle="bold"
        width={cardWidth - (padding * 2)}
        ellipsis={true}
      />
    </Group>
  );
};

export default NoteCard;