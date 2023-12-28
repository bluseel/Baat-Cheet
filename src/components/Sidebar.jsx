
import Navbar from "./Navbar"
import Search from "./Search";
import Chats from "./Chats"

const Sidebar = (props) =>{
    const mobileView = props.showSideBar;
    
   return(
    <div className={`sidebar ${mobileView ? 'showSidebar' : 'hideSideBar'}`}>
        <Navbar/>
        <Search/>
        <Chats setShowSideBar={props.setShowSideBar}/>
    </div>
   )
}

export default Sidebar;