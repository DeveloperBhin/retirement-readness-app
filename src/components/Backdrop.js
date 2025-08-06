import { useContext } from "react"
import { AppContext } from "../App"

export default function Backdrop(props) {

  const appContext = useContext(AppContext);

  function handleBackdropClick() {
    if(appContext.showConfirmDialog) {
      //force user to confirm action
    } else {
      appContext.navBack();
    }
  }

  return (
    <div 
      className="Backdrop"
      id="Backdrop"
      onClick={handleBackdropClick}
      style={(props.style) ? props.style : {}}
    >
    </div>
  )
}