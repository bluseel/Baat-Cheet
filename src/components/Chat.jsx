import Messages from "./Messages"
import Input from "./Input"
import { ChatContext } from "../context/ChatContext";
import { useContext, useState } from "react";

const Chat = (prop) =>{
    const {data} = useContext(ChatContext);
    const [sidebarShown, setSidebarShown ] = useState(false);
    
    const handleMenu=()=>{

        prop.onStateChange((prev)=>{
            setSidebarShown(prev)
            return !prev;
        })

    }

    return(
     <div className="chat">
        <div className="chatInfo">
            <span>{data.user?.displayName}</span>
            <div className="chatIcons">
                {/* <img src="cam.svg" alt="" />
                <img src="add.svg" alt=""  style={{marginRight:"20px"}}/> */}
                <img src= {sidebarShown?'hamburger.svg':'cross.svg' } className="mobileInteface" onClick={handleMenu} style={{zIndex:"99999", position:"fixed", right:"10px", top:"22px"}}/>
            </div>
        </div>
        <Messages/>
        <Input/>
     </div>
    )
 }
 
 export default Chat;