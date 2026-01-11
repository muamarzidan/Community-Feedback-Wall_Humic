import { useCallback, useMemo } from 'react';
import useImage from 'use-image';
import { Group, Rect, Text, Image } from 'react-konva';

import { isTokenAuthenticated } from '@/utils/auth/getAuthenticatedToken.js';
import { replaceUserTypeNames } from '@/utils/notes/noteUserReplaceNameType.js';
import { getUserTypeDisplay } from '@/utils/notes/noteUserNameType.js';
import { formatReactionCount } from '@/utils/notes/formatReactionCounts.js';
import { formatDate } from '@/utils/formatDate.js';
import { svgEdit, svgDelete } from '@/components/ui/page/notes/svgNoteIcon.jsx';


const SvgIcon = ({ svg, x, y, size = 12, onClick, onMouseEnter, onMouseLeave }) => {
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
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    )
  );
};

const NoteCard = ({ note, onEdit, onDelete, onReactionUpdate, onGuestWarning, onImageClick, cursorMode = 'drag' }) => {
  const [image] = useImage(note.image);

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
  const handleButtonMouseEnter = (e) => {
    const stage = e.target.getStage();
    if (stage) {
      stage.container().style.cursor = 'pointer';
    };
  };
  const handleButtonMouseLeave = (e) => {
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
    const maxTitleLines = 3;
    
    // Measure actual text height
    const titleHeightRaw = measureTextHeight(
      note.title, 
      titleFontSize, 
      'bold', 
      contentWidth, 
      titleLineHeight
    );
    
    // Cap title at 3 lines maximum
    const maxTitleHeight = titleFontSize * titleLineHeight * maxTitleLines;
    const titleHeight = Math.min(titleHeightRaw, maxTitleHeight);
    
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
    const stage = e.target.getStage();
    if (cursorMode === 'default' || stage.container().style.cursor === 'pointer') {
      if (!isTokenAuthenticated()) {
        if (onGuestWarning) {
          onGuestWarning('Please login to react to notes');
        };
        return;
      };
      
      if (onReactionUpdate) {
        onReactionUpdate(note.id, reactionType);
      };
    };
  }, [note.id, onReactionUpdate, onGuestWarning, cursorMode]);
  const handleEditClick = useCallback((e) => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    if (cursorMode === 'default' || stage.container().style.cursor === 'pointer') {
      onEdit();
    };
  }, [onEdit, cursorMode]);
  const handleDeleteClick = useCallback((e) => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    if (cursorMode === 'default' || stage.container().style.cursor === 'pointer') {
      onDelete();
    };
  }, [onDelete, cursorMode]);
  const handleImageClick = useCallback((e) => {
    e.cancelBubble = true;
    if (note.image && onImageClick) {
      onImageClick(note.image);
    };
  }, [note.image, onImageClick]);

  // Calculate Y positions
  let currentY = padding;
  const headerHeight = 5;
  const headerGap = isOwner ? 36 : 24;
  const titleY = currentY + headerHeight + headerGap;
  const imageY = titleY + dimensions.titleHeight + 8;
  const descY = imageY + (dimensions.imageHeight > 0 ? dimensions.imageHeight + 12 : 0);
  const reactionsY = descY + (dimensions.descHeight > 0 ? dimensions.descHeight + 12 : 0);
  const dateY = reactionsY + 26 + 20;

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
          text={`${replaceUserTypeNames(note)} ${getUserTypeDisplay(note)}`}
          fontSize={16}
          fill="#757575"
          width={isOwner ? 200 : 200}
          ellipsis={true}
        />
        {/* Date (Other people's notes) */}
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
        {/* Edit & Delete buttons (Logged-in owner) */}
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
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
            />
            <SvgIcon
              svg={svgEdit}
              x={cardWidth - 73}
              y={currentY + 4}
              size={17}
              onClick={handleEditClick}
              cursorMode={cursorMode}
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
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
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
            />
            <SvgIcon
              svg={svgDelete}
              x={cardWidth - 35}
              y={currentY + 4}
              size={16}
              onClick={handleDeleteClick}
              cursorMode={cursorMode}
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
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
        height={dimensions.titleHeight}
        ellipsis={true}
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
            fill="#FFFFFFFF"
          />
          <Image
            x={padding + 2}
            y={imageY + 2}
            image={image}
            width={contentWidth}
            height={172}
            cornerRadius={6}
            crop={(() => {
              const imgWidth = image.width;
              const imgHeight = image.height;
              const targetWidth = contentWidth;
              const targetHeight = 172;
              
              const imgRatio = imgWidth / imgHeight;
              const targetRatio = targetWidth / targetHeight;
              
              let cropX = 0;
              let cropY = 0;
              let cropWidth = imgWidth;
              let cropHeight = imgHeight;
              
              if (imgRatio > targetRatio) {
                // Image is wider - crop sides
                cropWidth = imgHeight * targetRatio;
                cropX = (imgWidth - cropWidth) / 2;
              } else {
                // Image is taller - crop top/bottom
                cropHeight = imgWidth / targetRatio;
                cropY = (imgHeight - cropHeight) / 2;
              }
              
              return {
                x: cropX,
                y: cropY,
                width: cropWidth,
                height: cropHeight
              };
            })()}
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
        height={dimensions.descHeight}
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
                onMouseEnter={handleButtonMouseEnter}
                onMouseLeave={handleButtonMouseLeave}
              />
              
              {/* Reaction Emoji */}
              <Text
                x={padding + reaction.x + (note.reactions?.[reaction.type] >= 10 ? 3 : 8)}
                y={reactionsY + 5}
                text={reaction.emoji}
                fontSize={16}
                onClick={(e) => handleReactionClick(reaction.type, e)}
                onTap={(e) => handleReactionClick(reaction.type, e)}
                onMouseEnter={handleButtonMouseEnter}
                onMouseLeave={handleButtonMouseLeave}
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
                onMouseEnter={handleButtonMouseEnter}
                onMouseLeave={handleButtonMouseLeave}
              />
            </Group>
          );
        })}
      </Group>
      {/* Date (logged-in owner) */}
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