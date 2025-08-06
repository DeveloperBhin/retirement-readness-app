import { useContext } from "react"
import { AppContext } from "../App"

export default function MainBody(props) {

  const appContext = useContext(AppContext);


  return (
    <div 
      className="MainBody mNoScrollBar"
      data-sidebar-open={appContext.isSideBarOpen}
    >
      {appContext.mainView}
    </div>
  )
}