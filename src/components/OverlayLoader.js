import { useContext } from "react"
import { AppContext } from "../App"
import { getInlineLoader } from "../Helpers";

export default function OverlayLoader(props) {

  const appContext = useContext(AppContext);

  

  return (
    <div 
      className="OverlayLoader"
      style={{
        display: (appContext.showOverlayLoader) ? 'block' : 'none',
      }}
    >
      {getInlineLoader()}
    </div>
  )
}