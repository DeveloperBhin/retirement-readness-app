// src/components/Viewer.js
import React, { useContext, useRef, useEffect } from 'react';
import { AppContext } from '../App';

export default function Viewer() {
  const appContext = useContext(AppContext);
  const viewerRef = useRef();

  useEffect(() => {
    const viewer = viewerRef.current;

    if (appContext.showViewer) {
      viewer.classList.remove('hiding');
      viewer.classList.add('visible');
      document.body.style.overflow = 'hidden';
    } else {
      viewer.classList.remove('visible');
      viewer.classList.add('hiding');
      document.body.style.overflow = 'auto';

      const timer = setTimeout(() => {
        if (!appContext.showViewer) {
          appContext.setViewerView(null);
        }
      }, 300); // Delay to allow CSS transition
      return () => clearTimeout(timer);
    }
  }, [appContext.showViewer]);

  const handleClose = () => {
    appContext.setShowViewer(false);
  };

  return (
    <div ref={viewerRef} className="viewer-wrapper">
      <div className="viewer-inner">
        <div className="viewer-close" onClick={handleClose}>
          &times;
        </div>
        <div className="viewer-body">
          {appContext.viewerView}
        </div>
      </div>
    </div>
  );
}
