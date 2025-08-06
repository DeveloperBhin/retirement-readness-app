import { useContext, useEffect, useState } from "react"
import { AppContext } from "../App"
import { MdLogout, MdMenu, MdNotifications, MdOutlineMessage, MdOutlineNotifications } from "react-icons/md";
import { IoChevronBack, IoNotificationsOutline, IoRefreshCircleOutline } from "react-icons/io5";
import { TbMessageDots, TbNotification } from "react-icons/tb";
import { callApi, getTopBarTitle, setCookie } from "../Helpers";
import { AiOutlineNotification, AiOutlineUser, AiTwotoneNotification } from 'react-icons/ai';
import Logo from "../ones/Logo";
import { BiSolidNotification } from "react-icons/bi";

export default function TopBar(props) {

  const appContext = useContext(AppContext);
  const [title, setTitle] = useState("");


  useEffect(() => {
    let _title = getTopBarTitle(appContext); 

    if(_title) {
      setTitle(_title);
    }
  }, [ appContext.navItem, appContext.navSubItem, appContext.navExtraItem, appContext.navMoreItem ])

  return (
    <div
      className="TopBar mShadow3"
    >

      <div
        className="container d-flex justify-content-between"
        style={{
          height: "100%",
        }}
      >


        <div
          className="mIcon text-start mOneLineText"
        >
          {title}
        </div>



        <div
          className="mIcon text-end"
        >
          <IoNotificationsOutline
            className="mSymbol"
            onClick={() => {
              appContext.navTo({
                item: 'notifications',
              })
            }}
          />
        </div>

      </div>
    </div>
  )
}