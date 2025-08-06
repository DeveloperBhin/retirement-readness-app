import { useContext, useEffect, useRef } from "react"
import { AppContext } from "../App"
import { MdArrowBack, MdClose } from 'react-icons/md';
import Backdrop from "./Backdrop";
import { STR_NO, STR_YES } from "../Strings";

export default function ConfirmDialog(props) {

  const appContext = useContext(AppContext);
  const viewerRef = useRef(null);



  const showModal = (viewer) => {
    if (viewer) {
      viewer.classList.remove('hiding');
      viewer.classList.add('visible');
      document.body.classList.add('modal-open'); // Lock scrolling on body
    }
  };

  const hideModal = (viewer) => {
    if (viewer) {
      viewer.classList.add('hiding');
      setTimeout(() => {
        viewer.classList.remove('visible');
        viewer.classList.remove('hiding');
        document.body.classList.remove('modal-open'); // Re-enable body scrolling
      }, 300); // Match this with the CSS transition duration
    }
  };

  useEffect(() => {
    const viewer = viewerRef.current;

    if (appContext.showConfirmDialog) {
      showModal(viewer);
    } else {
      hideModal(viewer);
    }
  }, [appContext.showConfirmDialog]);

  return (
    <>
      <Backdrop
        style={{
          visibility: (appContext.showConfirmDialog === true) ? "visible" : "hidden",
          opacity: (appContext.showConfirmDialog === true) ? "1" : "0",
          zIndex: "var(--highestIndex)",
        }}
      />
      <div
        className="ConfirmDialog mShadow3"
        ref={viewerRef}
      >
        <div className="header bg-secondary">
          <div
            className="container d-flex justify-content-between"
            style={{
              height: "100%",
            }}
          >
            <h4
              className="align-self-center mNoMargin font-semi-bold"
              style={{
                fontSize: "16px",
              }}
            >
              Confirm Dialog
            </h4>

            <MdClose
              className="align-self-center"
              size={30}
              style={{
                flexShrink: "0",
                cursor: "pointer",
              }}
              onClick={() => {
                hideModal();
                appContext.setShowConfirmDialog(false);
              }}
            />

          </div>
        </div>

        <div className="body bg-background">
          <h6
            style={{
              fontSize: "18px",
              padding: "10px",
              wordWrap: "break-word",
            }}
          >
            {appContext.confirmDialogMessage}
          </h6>
        </div>

        <div className="footer bg-background">
          <div
            className="container d-flex justify-content-end"
            style={{
              height: "100%",
            }}
          >
            <button
              className="btn btn-sm align-self-center"
              style={{
                flexShrink: "0",
                width: "80px",
                marginRight: "10px",
              }}
              onClick={() => {
                appContext.setShowConfirmDialog(false);
              }}
            >
              {STR_NO[appContext.language]}
            </button>

            <button
              className="btn btn-sm align-self-center btn-secondary"
              style={{
                flexShrink: "0",
                width: "80px",
              }}
              onClick={() => {
                appContext.setShowConfirmDialog(false);
                try {
                  if (appContext.confirmDialogAction) {
                    appContext.confirmDialogAction();
                  }
                } catch (error) {
                  //error
                }
              }}
            >
              {STR_YES[appContext.language]}
            </button>
          </div>
        </div>

      </div>
    </>
  )
}