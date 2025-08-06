import { useContext } from "react"
import { AppContext } from "../App"
import { MdHome, MdLogout, MdMenu, MdNotifications, MdOutlineMessage, MdOutlineNotifications } from "react-icons/md";
import { IoNotificationsOutline, IoRefreshCircleOutline } from "react-icons/io5";
import { TbMessageDots, TbReportAnalytics } from "react-icons/tb";
import { callApi, setCookie } from "../Helpers";
import { AiOutlineMessage, AiOutlineUser } from 'react-icons/ai';
import { STR_ACCOUNT, STR_CONTACTS, STR_LEARN, STR_MENU_DATING, STR_MENU_DOCTORS, STR_MENU_HOME, STR_MENU_INBOX, STR_MESSAGES, STR_TRACK } from "../Strings";
import { RiContactsBookLine, RiHome6Fill, RiHomeLine } from 'react-icons/ri';
import { GiLovers, GiTalk } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { LiaSchoolSolid } from "react-icons/lia";
import { CgProfile } from "react-icons/cg";
import { GrUserSettings } from "react-icons/gr";


export default function BottomBar(props) {

  const appContext = useContext(AppContext);

  return (
    <div
      className="BottomBar"
    >
      <div className="d-flex justify-content-between" style={{ height: "100%" }}>

        <div
          className="mIcon text-center"
          data-active={appContext.navItem === 'messages' || !appContext.navItem}
          onClick={() => {
            appContext.navTo({
              item: 'messages',
            })
          }}
        >
          <AiOutlineMessage className="mSymbol" />
          <h6 className="mText">{STR_MESSAGES[appContext.language]}</h6>
        </div>

        <div
          className="mIcon text-center"
          data-active={appContext.navItem === 'contacts'}
          onClick={() => {
            appContext.navTo({
              item: 'contacts',
            })
          }}
        >
          <RiContactsBookLine className="mSymbol" />
          <h6 className="mText">{STR_CONTACTS[appContext.language]}</h6>
        </div>

        <div
          className="mIcon text-center"
          data-active={appContext.navItem === 'account'}
          onClick={() => {
            appContext.navTo({
              item: 'account',
            })
          }}
        >
          <GrUserSettings className="mSymbol" />
          <h6 className="mText">{STR_ACCOUNT[appContext.language]}</h6>
        </div>



      </div>
    </div>
  )
}