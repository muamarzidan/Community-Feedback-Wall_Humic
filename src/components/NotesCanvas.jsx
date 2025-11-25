import { useRef, useEffect, useState } from 'react';
import { Stage, Layer } from 'react-konva';

import { closeAllMenus } from '../utils/domUtils';
import NoteCard from './NoteCard';
import BackgroundCanvas from "../assets/images/backgorund-canvas.png";


const NotesCanvas = ({ 
  notes, 
  zoom, 
  cursorMode = 'drag',
  onNoteEdit, 
  onNoteDelete,
  onReactionUpdate,
  onStageClick,
  onGuestWarning,
  onImageClick,
  width = window.innerWidth,
  height = window.innerHeight 
}) => {
  const stageRef = useRef(null);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  // Handle wheel zoom
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e) => {
      e.evt.preventDefault();
      
      const scaleBy = 1.05;
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointer.x - stage.x()) / stage.scaleX(),
        y: (pointer.y - stage.y()) / stage.scaleY(),
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = Math.max(0.1, Math.min(3, stage.scaleX() * Math.pow(scaleBy, direction)));
      
      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      
      stage.position(newPos);
      setStagePosition(newPos);
    };

    stage.on('wheel', handleWheel);
    return () => stage.off('wheel', handleWheel);
  }, []);
  // Update zoom from external controls
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    
    stage.scale({ x: zoom, y: zoom });
  }, [zoom]);
  
  const handleDragEnd = (e) => {
    setStagePosition(e.target.position());
  };
  const handleMouseDown = (e) => {
    // Check if clicking on empty space (stage background)
    if (e.target === e.target.getStage()) {
      // Close any open menus when clicking on empty space
      closeAllMenus();
      onStageClick?.(e);
    };
  };
  // Prevent stage from getting confused when menu is clicked
  const handleClick = (e) => {
    // Let the event bubble up if it's not directly on the stage
    if (e.target !== e.target.getStage()) {
      return;
    };
  };

  return (
    <div 
      className="w-full h-full overflow-hidden bg-gray-50"
      style={{ cursor: cursorMode === 'drag' ? 'grab' : 'default', backgroundImage: `url(${BackgroundCanvas})` }}
    >
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        x={stagePosition.x}
        y={stagePosition.y}
        scaleX={zoom}
        scaleY={zoom}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onDragEnd={handleDragEnd}
        draggable={cursorMode === 'drag'}
      >
        <Layer>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              cursorMode={cursorMode}
              onEdit={() => onNoteEdit(note)}
              onDelete={() => onNoteDelete(note.id)}
              onReactionUpdate={onReactionUpdate}
              onGuestWarning={onGuestWarning}
              onImageClick={onImageClick}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default NotesCanvas;