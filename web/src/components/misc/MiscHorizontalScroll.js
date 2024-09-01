import React, { useRef, useState, useEffect } from 'react';
import "./MiscHorizontalScroll.css";

interface MiscFlagProps {
  country: object;
}

const MiscHorizontalScroll: React.FC = ({ content }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -150 : 150;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const handleScroll = () => checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="d-flex w-100 position-relative">
      <div
        ref={scrollContainerRef}
        className="flex-grow-1 d-flex overflow-hidden"
        style={{ whiteSpace: 'nowrap' }}
      >
        {content}
      </div>

      {canScrollLeft && (
        <div className="scroll-left position-absolute align-content-center start-0 h-100">
          <button
            className="btn btn-link"
            onClick={() => scroll('left')}
            aria-label="Scroll Left"
          >
            <i className="bi bi-arrow-left-circle-fill"></i>
          </button>
        </div>
      )}

      {canScrollRight && (
        <div className="scroll-right position-absolute align-content-center end-0 h-100">
          <button
            className="btn btn-link"
            onClick={() => scroll('right')}
            aria-label="Scroll Right"
          >
            <i className="bi bi-arrow-right-circle-fill"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default MiscHorizontalScroll;