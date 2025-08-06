import { useContext } from "react"
import { AppContext } from "../App"
import { MdDashboard, MdHome, MdOutlineAnalytics, MdOutlineDashboard, MdOutlinePayment, MdOutlinePayments, MdOutlineSpaceDashboard, MdPayments, MdSubject } from "react-icons/md";
import { PiBuildingOfficeBold, PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { GoPerson } from "react-icons/go";


export default function SideBar(props) {

  const appContext = useContext(AppContext);



  return (
    <div
      className="SideBar"
      data-open={appContext.isSideBarOpen}
    >
      <div className="body mNoScrollBar">



        {
          (
            appContext.currentUserData.role === 'admin'
          ) ?
            <>
              <div
                className="pill"
                onClick={() => {
                  appContext.navTo({
                    item: 'dashboard'
                  })
                  appContext.setIsSideBarOpen(false);
                }}
                data-active={(appContext.navItem === 'dashboard' || !appContext.navItem)}
              >
                <MdOutlineDashboard className="icon" />
                <p className="text">Dashboard</p>
              </div>

              <div
                className="pill"
                onClick={() => {
                  appContext.navTo({
                    item: 'coins_orders'
                  })
                  appContext.setIsSideBarOpen(false);
                }}
                data-active={(appContext.navItem === 'coins_orders')}
              >
                <PiBuildingOfficeBold className="icon" />
                <p className="text">Coins Orders</p>
              </div>

              <div
                className="pill"
                onClick={() => {
                  appContext.navTo({
                    item: 'awards'
                  })
                  appContext.setIsSideBarOpen(false);
                }}
                data-active={(appContext.navItem === 'awards')}
              >
                <SiGoogleclassroom className="icon" />
                <p className="text">Awards</p>
              </div>


            </> : ""
        }




      </div>
    </div>
  )
}