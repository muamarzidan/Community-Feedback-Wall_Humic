import { useCallback, useRef, useState } from 'react';
import useImage from 'use-image';
import { Group, Rect, Text, Image } from 'react-konva';

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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
</svg>
`;
const svgDelete = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
  <path d="M15 4V3a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1H5v2h14V4h-4zM6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6H6zm4 2h2v10h-2V8zm4 0h2v10h-2V8z"/>
</svg>
`;


const NoteCard = ({ note, onEdit, onDelete, onReactionUpdate, cursorMode = 'drag' }) => {
  const [image] = useImage(note.image);

  const cardWidth = 300;
  const minCardHeight = note.image ? 320 : 220;
  const cornerRadius = 12;
  const padding = 12;
  
  // Calculate dynamic height based on content
  const calculateCardHeight = () => {
    let height = minCardHeight;
    const descriptionText = note.description || note.content || '';
    
    // More accurate text measurement (approximately 35 chars per line for 276px width)
    const charsPerLine = 35;
    const estimatedLines = Math.max(1, Math.ceil(descriptionText.length / charsPerLine));
    const baseLines = note.image ? 3 : 4; // Base lines included in minHeight
    
    if (estimatedLines > baseLines) {
      const extraLines = estimatedLines - baseLines;
      height += extraLines * 15; // 15px per extra line
    }
    
    // Add extra height for own notes (date below reactions)
    if (note.userType === 'you') {
      height += 15;
    }
    
    return height;
  };
  const cardHeight = calculateCardHeight();
  const handleReactionClick = useCallback((reactionType, e) => {
    e.cancelBubble = true;
    if (onReactionUpdate && cursorMode === 'default') {
      onReactionUpdate(note.id, reactionType);
    }
  }, [note.id, onReactionUpdate, cursorMode]);
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
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const reactions = [
    { emoji: '❤️', type: 'heart', x: 0 },
    { emoji: '👍', type: 'thumbsUp', x: 32 },
    { emoji: '⭐', type: 'star', x: 64 },
    { emoji: '😊', type: 'smile', x: 96 },
    { emoji: '🔥', type: 'fire', x: 128 }
  ];

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
          text={` ${replaceUserTypeNames(note)} ${getUserTypeDisplay()}`}
          fontSize={12}
          fontStyle="bold"
          fill="#374151"
          width={note.userType === 'you' ? 180 : 180}
          ellipsis={true}
        />
        {/* Date for other people's notes (next to name) */}
        {note.userType !== 'you' && (
          <Text
            x={cardWidth - 80}
            y={currentY}
            text={formatDate(note.createdAt)}
            fontSize={10}
            fill="#9ca3af"
            align="right"
          />
        )}
        {/* Edit & Delete buttons for own notes */}
        {note.userType === 'you' && (
          <Group>
            {/* Edit Button */}
            <Rect
              x={cardWidth - 80}
              y={currentY - 2}
              width={35}
              height={20}
              fill="#3b82f6"
              cornerRadius={4}
              onClick={handleEditClick}
              onTap={handleEditClick}
              listening={cursorMode === 'default'}
            />
            <SvgIcon
              svg={svgEdit}
              x={cardWidth - 70}
              y={currentY + 1}
              size={14}
              onClick={handleEditClick}
              cursorMode={cursorMode}
            />
            {/* Delete Button */}
            <Rect
              x={cardWidth - 42}
              y={currentY - 2}
              width={35}
              height={20}
              fill="#ef4444"
              cornerRadius={4}
              onClick={handleDeleteClick}
              onTap={handleDeleteClick}
              listening={cursorMode === 'default'}
            />
            <SvgIcon
              svg={svgDelete}
              x={cardWidth - 32}
              y={currentY + 1}
              size={14}
              onClick={handleDeleteClick}
              cursorMode={cursorMode}
            />
          </Group>
        )}
      </Group>

      {/* Title */}
      {(() => {
        currentY += 30;
        return (
          <Text
            x={padding}
            y={currentY}
            text={note.title}
            fontSize={16}
            fontStyle="bold"
            fill="#1f2937"
            width={cardWidth - (padding * 2)}
            wrap="word"
            height={40}
          />
        );
      })()}

      {/* Description */}
      {(() => {
        currentY += 50;
        const descriptionText = note.description || note.content || '';
        
        // Calculate available height for description
        let availableHeight = cardHeight - currentY - (note.image ? 150 : 70); // Leave space for image + reactions + date
        if (note.userType === 'you') {
          availableHeight -= 15; // Extra space for date below reactions
        }
        
        return (
          <Text
            x={padding}
            y={currentY}
            text={descriptionText}
            fontSize={12}
            fill="#6b7280"
            width={cardWidth - (padding * 2)}
            height={Math.max(40, availableHeight)}
            wrap="word"
          />
        );
      })()}

      {/* Image (if exists) */}
      {note.image && image && (() => {
        // Calculate position for image (fixed distance from bottom)
        const imageY = cardHeight - (note.userType === 'you' ? 155 : 140); // Account for reactions + date
        return (
          <Group>
            <Rect
              x={padding}
              y={imageY}
              width={cardWidth - (padding * 2)}
              height={100}
              cornerRadius={8}
              fill="white"
            />
            <Image
              x={padding + 2}
              y={imageY + 2}
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
        currentY = cardHeight - 35;
        return (
          <Group>
            {reactions.map((reaction) => (
              <Group key={reaction.type}>
                {/* Reaction Background */}
                <Rect
                  x={padding + reaction.x}
                  y={currentY}
                  width={28}
                  height={20}
                  fill="white"
                  cornerRadius={10}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                  onClick={(e) => handleReactionClick(reaction.type, e)}
                  onTap={(e) => handleReactionClick(reaction.type, e)}
                  listening={cursorMode === 'default'}
                />
                {/* Reaction Emoji */}
                <Text
                  x={padding + reaction.x + 4}
                  y={currentY + 5}
                  text={reaction.emoji}
                  fontSize={10}
                  onClick={(e) => handleReactionClick(reaction.type, e)}
                  onTap={(e) => handleReactionClick(reaction.type, e)}
                  listening={cursorMode === 'default'}
                />
                {/* Reaction Count */}
                <Text
                  x={
                    note.reactions?.[reaction.type] >= 9
                      ? padding + reaction.x + 17
                      : padding + reaction.x + 20
                  }
                  y={currentY + 7}
                  text={(note.reactions?.[reaction.type] || 0).toString()}
                  fontSize={8}
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
      {note.userType === 'you' && (() => {
        currentY = cardHeight - 10;
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