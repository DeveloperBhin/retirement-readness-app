import { useContext, useEffect, useRef } from "react"
import { AppContext } from "../App"
import { MdArrowBack, MdClose } from 'react-icons/md';
import Backdrop from "./Backdrop";

export default function SideViewer(props) {

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
        if (!appContext.showViewer && !appContext.showBottomViewer) {
          document.body.classList.remove('modal-open'); // Re-enable body scrolling
        }
      }, 300); // Match this with the CSS transition duration
    }
  };

  useEffect(() => {
    const viewer = viewerRef.current;

    if (appContext.showSideViewer) {
      showModal(viewer);
    } else {
      hideModal(viewer);
    }
  }, [appContext.showSideViewer]);

  return (
    <>
      <Backdrop
        style={{
          visibility: (appContext.showSideViewer === true) ? "visible" : "hidden",
          opacity: (appContext.showSideViewer === true) ? "1" : "0",
          zIndex: "var(--highIndex)",
        }}
      />
      <div
        className="SideViewer mShadow2"
        ref={viewerRef}
      >
        <div className="header bg-background">
          <div
            className="container d-flex justify-content-end"
            style={{
              height: "100%",
            }}
          >
            <MdClose
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
          {appContext.sideViewerView}
        </div>
      </div>
    </>
  )
}