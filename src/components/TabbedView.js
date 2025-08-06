import React, { useState } from 'react';

const TabbedView = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleSwipe = (direction) => {
    if (direction === 'left' && activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    } else if (direction === 'right' && activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <div className="TabbedView">
      <div className="TabbedViewNavigation">
        <div
          className='container'
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              className={`TabbedViewNavigationButton ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
              data-active={activeTab === index}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>
      <div
        className="TabbedViewContent mNoScrollBar"
        onTouchStart={(e) => handleSwipeStart(e)}
        onTouchEnd={(e) => handleSwipeEnd(e, handleSwipe)}
      >
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

let touchStartX = 0;
let touchStartY = 0;

const handleSwipeStart = (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
};

const handleSwipeEnd = (e, handleSwipe) => {
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // Only consider a swipe if the horizontal movement is significantly greater than the vertical movement
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
    const swipeDirection = deltaX < 0 ? 'left' : 'right';
    handleSwipe(swipeDirection);
  }
};

export default TabbedView;
