import { useCallback } from 'react';
import useImage from 'use-image';
import { Group, Rect, Text, Image } from 'react-konva';

import { formatReactionCount } from '../utils/formatReactionCounts.js';
import { formatDate } from '../utils/formatDate.js';


const SvgIcon = ({ svg, x, y, size = 12, onClick, cursorMode }) => {
  const [icon] = useImage(
    `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  );

  return (
    icon && (
      <Image
        image={icon}
        x={x}
        y={y}
        width={size}
        height={size}
        onClick={onClick}
        onTap={onClick}
        listening={cursorMode === 'default'}
      />
    )
  );
};

const svgEdit = `
<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
  <path d="m15 5 4 4" />
</svg>
`;
const svgDelete = `
<svg stroke="#ffffff" fill="#ffffff" stroke-width="0" viewBox="0 0 16 16" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
</svg>
`;

const NoteCard = ({ note, onEdit, onDelete, onReactionUpdate, onGuestWarning, cursorMode = 'drag' }) => {
  const [image] = useImage(note.image);

  const isAuthenticated = () => {
    return !!localStorage.getItem('token_community-feedback');
  };

  const cardWidth = 355;
  const cornerRadius = 12;
  const padding = 16;
  const userData = localStorage.getItem('user-data_community-feedback');
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const currentUserId = parsedUserData ? parsedUserData?.id : null;
  const reactions = [
    { emoji: '❤️', type: 'heart', x: 0 },
    { emoji: '👍', type: 'thumbsUp', x: 66 },
    { emoji: '😂', type: 'laugh', x: 133 },
    { emoji: '😮', type: 'surprised', x: 200 },
    { emoji: '🔥', type: 'fire', x: 267 }
  ];


  const calculateTitleHeight = () => {
    const titleText = note.title;
    const avgCharsPerLine = 17; // Approximately for fontSize 20 bold
    const estimatedLines = Math.max(1, Math.ceil(titleText.length / avgCharsPerLine));
    const actualLines = Math.min(estimatedLines, 3); // Max 3 lines
    return actualLines * 24; // 24px per line (20px font + 4px line height)
  };
  // Calculate description height based on text length
  const calculateDescriptionHeight = () => {
    const descriptionText = note.description || note.content || '';
    const avgCharsPerLine = 45; // Approximately for fontSize 14
    const estimatedLines = Math.max(1, Math.ceil(descriptionText.length / avgCharsPerLine));
    return estimatedLines * 20; // 20px per line (14px font + 6px line height)
  };
  // Calculate dynamic card height based on all content
  const calculateCardHeight = () => {
    let height = 0;
    // Header (author name + date/buttons)
    height += 16; // Top padding
    height += 20; // Author name height
    height += 32; // Spacing after header
    // Title
    const titleHeight = calculateTitleHeight();
    height += titleHeight;
    height += 8; // Gap after title
    // Description
    const descriptionHeight = calculateDescriptionHeight();
    height += descriptionHeight;
    height += 12; // Gap after description
    // Image (if exists)
    if (note.image) {
      height += 100; // Image height
      height += 10; // Gap after image
    }
    // Reactions
    height += 26; // Reaction buttons height
    // Date for own notes (below reactions)
    if (note.userType === 'you') {
      height += 20; // Date height
    }
    height += 16; // Bottom padding

    return height;
  };
  const cardHeight = calculateCardHeight();
  const handleReactionClick = useCallback((reactionType, e) => {
    e.cancelBubble = true;
    if (cursorMode === 'default') {
      // Check if authenticated
      if (!isAuthenticated()) {
        // Show guest warning modal
        if (onGuestWarning) {
          onGuestWarning('Please login to react to notes');
        }
        return;
      }
      
      if (onReactionUpdate) {
        onReactionUpdate(note.id, reactionType);
      }
    }
  }, [note.id, onReactionUpdate, onGuestWarning, cursorMode]);
  const handleEditClick = useCallback((e) => {
    e.cancelBubble = true;
    if (cursorMode === 'default') {
      onEdit();
    }
  }, [onEdit, cursorMode]);
  const handleDeleteClick = useCallback((e) => {
    e.cancelBubble = true;
    if (cursorMode === 'default') {
      onDelete();
    }
  }, [onDelete, cursorMode]);
  const getUserTypeDisplay = () => {
    switch (note.userType) {
      case 'you':
        return '(You)';
      case 'guest':
        return '';
      case 'people':
        return '';
      default:
        return '';
    }
  };
  function replaceUserTypeNames (note) {
    if (note.userType === 'guest') {
      note.author = "Guest"
      return note.author;
    }
    return note.author;
  };
  const findNotesUserIdToLocalStorage = (userId) => {
    if (userId === currentUserId) {
      return true;
    };
    return false;
  };

  let currentY = padding;

  return (
    <Group x={note.x} y={note.y}>
      {/* Card Background */}
      <Rect
        width={cardWidth}
        height={cardHeight}
        fill={note.backgroundColor || '#fef3c7'}
        cornerRadius={cornerRadius}
        shadowColor="rgba(0,0,0,0.1)"
        shadowOffset={{ x: 0, y: 2 }}
        shadowBlur={8}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
      {/* Header Section */}
      <Group>
        {/* Author Name */}
        <Text
          x={padding}
          y={currentY}
          text={`${replaceUserTypeNames(note)} ${getUserTypeDisplay()}`}
          fontSize={16}
          fill="#757575"
          width={findNotesUserIdToLocalStorage(note.userId) ? 162 : 162}
          ellipsis={true}
        />
        {/* Date for other people's notes (next to name) */}
        {!findNotesUserIdToLocalStorage(note.userId) && (
          <Text
            x={cardWidth - 85}
            y={currentY}
            text={formatDate(note.createdAt)}
            fontSize={14}
            fill="#757575"
            align="right"
          />
        )}
        {/* Edit & Delete buttons for own notes */}
        {findNotesUserIdToLocalStorage(note.userId) && (
          <Group>
            {/* Edit Button */}
            <Rect
              x={cardWidth - 80}
              y={currentY - 2}
              width={30}
              height={30}
              fill="#ffffff"
              cornerRadius={100}
              onClick={handleEditClick}
              onTap={handleEditClick}
              listening={cursorMode === 'default'}
            />
            <SvgIcon
              svg={svgEdit}
              x={cardWidth - 73}
              y={currentY + 4}
              size={17}
              onClick={handleEditClick}
              cursorMode={cursorMode}
              fill="#000000"
            />
            {/* Delete Button */}
            <Rect
              x={cardWidth - 42}
              y={currentY - 2}
              width={30}
              height={30}
              fill="#EC221F"
              cornerRadius={100}
              onClick={handleDeleteClick}
              onTap={handleDeleteClick}
              listening={cursorMode === 'default'}
            />
            <SvgIcon
              svg={svgDelete}
              x={cardWidth - 35}
              y={currentY + 4}
              size={16}
              onClick={handleDeleteClick}
              cursorMode={cursorMode}
            />
          </Group>
        )}
      </Group>
      {/* Title */}
      {(() => {
        currentY += 32;
        const titleHeight = calculateTitleHeight();
        const maxTitleHeight = 72; // Max 3 lines (24px * 3)
        return (
          <Text
            x={padding}
            y={currentY}
            text={note.title}
            fontSize={20}
            fontStyle="bold"
            fill="#000000"
            width={cardWidth - (padding * 2)}
            wrap="word"
            height={maxTitleHeight}
            ellipsis={true}
          />
        );
      })()}
      {/* Description */}
      {(() => {
        const titleHeight = calculateTitleHeight();
        currentY += titleHeight + 8; // Actual title height + 8px gap
        const descriptionText = note.description || note.content || '';
        const descriptionHeight = calculateDescriptionHeight();
        
        return (
          <Text
            x={padding}
            y={currentY}
            text={descriptionText}
            fontSize={14}
            fill="#000000"
            width={cardWidth - (padding * 2)}
            wrap="word"
          />
        );
      })()}
      {/* Image (if exists) */}
      {note.image && image && (() => {
        const titleHeight = calculateTitleHeight();
        const descriptionHeight = calculateDescriptionHeight();
        currentY += descriptionHeight + 12; // Description height + 12px gap
        
        return (
          <Group>
            <Rect
              x={padding}
              y={currentY}
              width={cardWidth - (padding * 2)}
              height={100}
              cornerRadius={8}
              fill="white"
            />
            <Image
              x={padding + 2}
              y={currentY + 2}
              image={image}
              width={cardWidth - (padding * 2) - 4}
              height={96}
              cornerRadius={6}
            />
          </Group>
        );
      })()}
      {/* Reactions Section */}
      {(() => {
        const titleHeight = calculateTitleHeight();
        const descriptionHeight = calculateDescriptionHeight();
        currentY += descriptionHeight + 12; // Move past description
        
        if (note.image) {
          currentY += 100 + 10; // Image height + gap
        }
        
        return (
          <Group>
            {reactions.map((reaction) => (
              <Group key={reaction.type}>
                {/* Reaction Background */}
                <Rect
                  x={padding + reaction.x}
                  y={currentY}
                  width={56}
                  height={26}
                  fill="white"
                  cornerRadius={100}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  onClick={(e) => handleReactionClick(reaction.type, e)}
                  onTap={(e) => handleReactionClick(reaction.type, e)}
                  listening={cursorMode === 'default'}
                />
                {/* Reaction Emoji */}
                <Text
                  x={
                    note.reactions?.[reaction.type] >= 9
                      ? padding + reaction.x + 3
                      : padding + reaction.x + 8
                  }
                  y={currentY + 5}
                  text={reaction.emoji}
                  fontSize={16}
                  onClick={(e) => handleReactionClick(reaction.type, e)}
                  onTap={(e) => handleReactionClick(reaction.type, e)}
                  listening={cursorMode === 'default'}
                />
                {/* Reaction Count */}
                <Text
                  x={padding + reaction.x + 24}
                  y={currentY + 5}
                  text={formatReactionCount(note.reactions?.[reaction.type] || 0)}
                  fontSize={14}
                  fill="#374151"
                  fontStyle="bold"
                  onClick={(e) => handleReactionClick(reaction.type, e)}
                  onTap={(e) => handleReactionClick(reaction.type, e)}
                  listening={cursorMode === 'default'}
                />
              </Group>
            ))}
          </Group>
        );
      })()}
      {/* Date for own notes (below reactions) */}
      {findNotesUserIdToLocalStorage(note.userId) && (() => {
        currentY += 26 + 4; // Reaction height + small gap
        return (
          <Text
            x={cardWidth - 80}
            y={currentY}
            text={formatDate(note.createdAt)}
            fontSize={10}
            fill="#9ca3af"
            align="right"
          />
        );
      })()}
    </Group>
  );
};

export default NoteCard;