import { useContext } from "react"
import { AppContext } from "../App"
import { getInlineLoader } from "../Helpers";

export default function MainLoader(props) {

  const appContext = useContext(AppContext);

  

  return (
    <div 
      className="MainLoader mSupportLoading"
    >
      {getInlineLoader()}
    </div>
  )
}