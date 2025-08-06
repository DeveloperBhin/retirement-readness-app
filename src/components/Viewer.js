import { useContext, useEffect, useRef } from "react"
import { AppContext } from "../App"
import { MdArrowBack } from 'react-icons/md';
import Backdrop from "./Backdrop";

export default function Viewer(props) {

  const appContext = useContext(AppContext);
  const viewerRef = useRef(null);



  const showModal = (viewer) => {
    if (viewer) {
      viewer.classList.remove('hiding');
      viewer.classList.add('visible');
      setTimeout(() => {
        document.body.classList.add('modal-open');
      }, 300) // Lock scrolling on body
    }
  };

  const hideModal = (viewer) => {
    if (viewer) {
      viewer.classList.add('hiding');
      setTimeout(() => {
        viewer.classList.remove('visible');
        viewer.classList.remove('hiding');
        if (!appContext.showSideViewer && !appContext.showBottomViewer) {
          document.body.classList.remove('modal-open'); // Re-enable body scrolling
        }
      }, 300); // Match this with the CSS transition duration
    }
  };

  useEffect(() => {
    const viewer = viewerRef.current;

    if (appContext.showViewer) {
      showModal(viewer);
    } else {
      hideModal(viewer);
    }
  }, [appContext.showViewer]);

  return (
    <>
      <Backdrop
        style={{
          visibility: (appContext.showViewer === true) ? "visible" : "hidden",
          opacity: (appContext.showViewer === true) ? "1" : "0",
          zIndex: "var(--lowIndex)",
        }}
      />
      <div
        className="Viewer"
        ref={viewerRef}
      >
        <div className="header bg-secondary">
          <div
            className="container d-flex"
            style={{
              height: "100%",
            }}
          >
            <MdArrowBack
              className="align-self-center"
              size={30}
              style={{
                flexShrink: "0",
                cursor: "pointer",
              }}
              onClick={appContext.navBack}
            />
          </div>
        </div>

        <div className="body bg-background">
          {appContext.viewerView}
        </div>
      </div>
    </>
  )
}