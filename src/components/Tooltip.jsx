// src/components/Tooltip.jsx
import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import '../styles/Tooltip.scss';

const Tooltip = ({ children, content }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef(null);

  const handleMouseEnter = (e) => {
    if (!content) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: rect.left + rect.width / 2, y: rect.top });
    timeoutRef.current = setTimeout(() => setVisible(true), 200); // fade delay
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <>
      {React.cloneElement(children, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })}
      {visible &&
        ReactDOM.createPortal(
          <div
            className="tooltip-content"
            style={{
              position: 'fixed',
              top: coords.y - 6,
              left: coords.x,
              transform: 'translate(-50%, -100%)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
