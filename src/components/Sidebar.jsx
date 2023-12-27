
import Navbar from "./Navbar"
import Search from "./Search";
import Chats from "./Chats"

const Sidebar = (props) =>{
    const mobileView = props.showSideBar;
    
   return(
    <div className={`sidebar ${mobileView ? 'showSidebar' : 'hideSideBar'}`}>
        <Navbar/>
        <Search/>
        <Chats/>
    </div>
   )
}

export default Sidebar;