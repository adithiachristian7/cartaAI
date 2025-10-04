import React, { useState, useEffect } from 'react';

function TypingAnimation({ text, speed = 100, loop = false, loopDelay = 7000 }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (loop && currentIndex >= text.length) {
      // For looping animation, restart after delay
      const restartTimeout = setTimeout(() => {
        setDisplayText('');
        setCurrentIndex(0);
      }, loopDelay);

      return () => clearTimeout(restartTimeout);
    }
  }, [currentIndex, text, speed, loop, loopDelay]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className="relative inline-block" style={{ minHeight: '1.2em' }}>
      <span className="invisible">
        {text}
      </span>
      <span
        className="absolute inset-0"
        style={{
          width: 'fit-content',
          maxWidth: '100%'
        }}
      >
        {displayText}
        <span
          className={`inline-block w-0.5 h-[1em] bg-primary ml-1 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-100`}
          style={{ verticalAlign: 'baseline' }}
        ></span>
      </span>
    </span>
  );
}

export default TypingAnimation;
