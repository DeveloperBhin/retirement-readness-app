// src/App.js
import { useState, useEffect, createContext } from "react";
import RetirementForm from './views/RetirementForm.js';
import { getMainView, getViewerView, getSideViewerView, callApi, getBottomViewerView, getCookie, setCookie } from "./Helpers";
import { ToastContainer, toast } from 'react-toastify';
import {
STR_FORM_INTRO_PARAGRAPH,STR_RETIREMENT_READNESS_CHECK,

} from './Strings.js';


export const AppContext = createContext(null);

function App() {
  const [showViewer, setShowViewer] = useState(false);
  const [viewerView, setViewerView] = useState(null);
  const [showOverlayLoader, setShowOverlayLoader] = useState(false); //controlling the display of OverlayLoader
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState("");
  const [confirmDialogAction, setConfirmDialogAction] = useState("");
  const [language, setLanguage] = useState('sw')


function activateDialog(params) {
    let {
      message,
      onConfirm
    } = params;
    setConfirmDialogAction(() => { return onConfirm });
    setConfirmDialogMessage(message)
    setShowConfirmDialog(true);
  }

  function changeLanguage() {
    if (language === 'en') {
      setLanguage('sw');
    } else {
      setLanguage('en');
    }
  }
  
  function tellError(msg) {
    toast.error(msg);
  }

  function tellInfo(msg) {
    toast.info(msg);
  }

  function tellWarning(msg) {
    toast.warn(msg);
  }

  function tellMessage(msg) {
    toast.success(msg);
  }

  function refresh() {
    /**
     * This function refreshes the whole app
     */
    window.location.reload(); //remember to optimize
  }

  const navBack = () => {
    setShowViewer(false);
    setViewerView(null);
    window.history.back();

    setShowOverlayLoader(false);

  };

   

  

  const appContext = {
    showViewer,
    setShowViewer,
    viewerView,
    setViewerView,
    navBack,
    setShowOverlayLoader,
    activateDialog,
    changeLanguage,
    setLanguage,
    language,
    tellError,
    tellInfo,
    tellMessage,
    tellWarning,
    refresh,

  };

  return (
    <AppContext.Provider value={appContext}>
  <div className="App">
    <header className="app-header">
      <h1 className="text-center">      {STR_RETIREMENT_READNESS_CHECK[appContext.language]}
<div className="col-12 text-end mt-3 px-5">
                          
                          </div>
                      
</h1>
    </header>

   <div className="container alert alert-info mt-4">
      {STR_FORM_INTRO_PARAGRAPH[appContext.language]}
    </div>

    <RetirementForm />
  </div>
</AppContext.Provider>

  );
}

export default App;
