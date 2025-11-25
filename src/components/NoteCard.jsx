import { useCallback, useMemo } from 'react';
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

const NoteCard = ({ note, onEdit, onDelete, onReactionUpdate, onGuestWarning, onImageClick, cursorMode = 'drag' }) => {
  const [image] = useImage(note.image);

  const isAuthenticated = () => {
    return !!localStorage.getItem('token_community-feedback');
  };

  const handleImageMouseEnter = (e) => {
    const stage = e.target.getStage();
    if (stage) {
      stage.container().style.cursor = 'pointer';
    };
  };

  const handleImageMouseLeave = (e) => {
    const stage = e.target.getStage();
    if (stage) {
      stage.container().style.cursor = cursorMode === 'drag' ? 'grab' : 'default';
    };
  };

  const cardWidth = 355;
  const cornerRadius = 12;
  const padding = 16;
  const contentWidth = cardWidth - (padding * 2); // 323px
  const userData = localStorage.getItem('user-data_community-feedback');
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const currentUserId = parsedUserData ? parsedUserData?.id : null;
  const reactions = [
    { emoji: '❤️', type: 'heart', x: 0 },
    { emoji: '👍', type: 'like', x: 66 },
    { emoji: '😂', type: 'laugh', x: 133 },
    { emoji: '😮', type: 'surprised', x: 200 },
    { emoji: '🔥', type: 'fire', x: 267 }
  ];

  const isOwner = useMemo(() => {
    if (!note?.userId || !currentUserId) return false;
    return note.userId === currentUserId;
  }, [note?.userId, currentUserId]);
  // Kalkulasi tinggi text dengan Canvas measurement (lebih akurat!)
  const measureTextHeight = (text, fontSize, fontStyle, maxWidth, lineHeight) => {
    if (!text || text.length === 0) return fontSize * lineHeight;
    
    // Create temporary canvas untuk measurement
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontStyle} ${fontSize}px Arial, sans-serif`;
    
    const words = text.split(' ');
    let lines = 1;
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + (currentLine ? ' ' : '') + words[i];
      const metrics = context.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines++;
        currentLine = words[i];
      } else {
        currentLine = testLine;
      };
    };
    
    return Math.ceil(lines * fontSize * lineHeight);
  };
  // Hitung dimensi semua elemen dengan measurement yang akurat
  const dimensions = useMemo(() => {
    const titleFontSize = 20;
    const descFontSize = 14;
    const titleLineHeight = 1.2; // Konva lineHeight multiplier
    const descLineHeight = 1.43;
    
    // Measure actual text height
    const titleHeight = measureTextHeight(
      note.title, 
      titleFontSize, 
      'bold', 
      contentWidth, 
      titleLineHeight
    );
    
    const descText = note.description || '';
    const descHeight = measureTextHeight(
      descText, 
      descFontSize, 
      'normal', 
      contentWidth, 
      descLineHeight
    );
    
    // Image height
    const imageHeight = note.image ? 176 : 0;
    
    return {
      titleHeight,
      descHeight,
      imageHeight
    };
  }, [note.title, note.description, note.image, contentWidth]);
  // Kalkulasi total height card
  const cardHeight = useMemo(() => {
    let height = 0;
    // Header section
    height += padding; // Top padding: 16
    height += 20; // Author name height
    height += (isOwner ? 36 : 24); // Space after header
    // Title
    height += dimensions.titleHeight;
    height += 8; // Gap after title
    // Description
    height += dimensions.descHeight;
    height += 12; // Gap after description
    // Image
    if (dimensions.imageHeight > 0) {
      height += dimensions.imageHeight;
      height += 10; // Gap after image
    }
    // Reactions
    height += 26; // Reaction buttons height
    // Date for owner (below reactions)
    if (isOwner) {
      height += 8; // Gap before date
      height += 18; // Date height
    };
    height += padding; // Bottom padding: 16
    
    return height;
  }, [dimensions, isOwner, padding]);
  const handleReactionClick = useCallback((reactionType, e) => {
    e.cancelBubble = true;
    if (cursorMode === 'default') {
      if (!isAuthenticated()) {
        if (onGuestWarning) {
          onGuestWarning('Please login to react to notes');
        }
        return;
      };
      
      if (onReactionUpdate) {
        onReactionUpdate(note.id, reactionType);
      };
    };
  }, [note.id, onReactionUpdate, onGuestWarning, cursorMode]);
  const handleEditClick = useCallback((e) => {
    e.cancelBubble = true;
    if (cursorMode === 'default') {
      onEdit();
    };
  }, [onEdit, cursorMode]);
  const handleDeleteClick = useCallback((e) => {
    e.cancelBubble = true;
    if (cursorMode === 'default') {
      onDelete();
    };
  }, [onDelete, cursorMode]);
  const handleImageClick = useCallback((e) => {
    e.cancelBubble = true;
    if (note.image && onImageClick) {
      onImageClick(note.image);
    };
  }, [note.image, onImageClick]);
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
    };
  };
  const replaceUserTypeNames = (note) => {
    if (note.userType === 'guest') {
      return "Guest";
    };
    return note.author;
  };

  // Calculate Y positions
  let currentY = padding;
  const headerHeight = 5;
  const headerGap = isOwner ? 36 : 24;
  const titleY = currentY + headerHeight + headerGap;
  const imageY = titleY + dimensions.titleHeight + 8;
  const descY = imageY + (dimensions.imageHeight > 0 ? dimensions.imageHeight + 12 : 0);
  const reactionsY = descY + (dimensions.descHeight > 0 ? dimensions.descHeight + 12 : 0);
  const dateY = reactionsY + 26 + 20;
  // const descY = titleY + dimensions.titleHeight + 8;
  // const imageY = descY + dimensions.descHeight + 12;
  // const reactionsY = imageY + (dimensions.imageHeight > 0 ? dimensions.imageHeight + 10 : 0);
  // const dateY = reactionsY + 26 + 8;

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
          width={isOwner ? 200 : 200}
          ellipsis={true}
        />
        {/* Date for other people's notes */}
        {!isOwner && (
          <Text
            x={cardWidth - 85}
            y={currentY}
            text={formatDate(note.createdAt)}
            fontSize={14}
            fill="#757575"
            align="right"
          />
        )}

        {/* Edit & Delete buttons for owner */}
        {isOwner && (
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
      <Text
        x={padding}
        y={titleY}
        text={note.title}
        fontSize={20}
        fontStyle="bold"
        fill="#000000"
        width={contentWidth}
        wrap="word"
        lineHeight={1.2}
      />
      {/* Image */}
      {note.image && image && (
        <Group
          onClick={handleImageClick}
          onTap={handleImageClick}
          onMouseEnter={handleImageMouseEnter}
          onMouseLeave={handleImageMouseLeave}
          listening={true}
        >
          <Rect
            x={padding}
            y={imageY}
            width={contentWidth}
            height={176}
            cornerRadius={8}
          />
          <Image
            x={padding + 2}
            y={imageY + 2}
            image={image}
            width={contentWidth - 4}
            height={172}
            cornerRadius={6}
            objectFit="cover"
          />
        </Group>
      )}
      {/* Description */}
      <Text
        x={padding}
        y={descY}
        text={note.description || ''}
        fontSize={14}
        fill="#000000"
        width={contentWidth}
        wrap="word"
        lineHeight={1.43}
      />
      {/* Reactions */}
      <Group>
        {reactions.map((reaction) => {
          return (
            <Group key={reaction.type}>
              {/* Reaction Background */}
              <Rect
                x={padding + reaction.x}
                y={reactionsY}
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
                x={padding + reaction.x + (note.reactions?.[reaction.type] >= 10 ? 3 : 8)}
                y={reactionsY + 5}
                text={reaction.emoji}
                fontSize={16}
                onClick={(e) => handleReactionClick(reaction.type, e)}
                onTap={(e) => handleReactionClick(reaction.type, e)}
                listening={cursorMode === 'default'}
              />
              
              {/* Reaction Count */}
              <Text
                x={padding + reaction.x + 32}
                y={reactionsY + 6}
                text={formatReactionCount(note.reactions?.[reaction.type] || 0)}
                fontSize={14}
                fill="#374151"
                fontStyle="bold"
                onClick={(e) => handleReactionClick(reaction.type, e)}
                onTap={(e) => handleReactionClick(reaction.type, e)}
                listening={cursorMode === 'default'}
              />
            </Group>
          );
        })}
      </Group>
      {/* Date for owner (below reactions) */}
      {isOwner && (
        <Text
          x={cardWidth - 86}
          y={dateY}
          text={formatDate(note.createdAt)}
          fontSize={14}
          fill="#757575"
          align="right"
        />
      )}
    </Group>
  );
};

export default NoteCard;