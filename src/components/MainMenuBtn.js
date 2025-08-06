import { useContext } from "react"
import { AppContext } from "../App"
import { MdClose, MdMenu } from "react-icons/md";

export default function MainMenuBtn(props) {

  const appContext = useContext(AppContext);

  function openSideBar() {
    appContext.setIsSideBarOpen(true);
  }

  function closeSideBar() {
    appContext.setIsSideBarOpen(false);
  }

  return (
    <div 
      className="MainMenuBtn mMobileOnly"
      data-sidebar-open={appContext.isSideBarOpen}
    >
      {
        (appContext.isSideBarOpen) ?
        <MdClose onClick={closeSideBar}/>
        :
        <MdMenu onClick={openSideBar}/>
      }
    </div>
  )
}