import Messages from "./Messages"
import Input from "./Input"
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";

const Chat = () =>{
    const {data} = useContext(ChatContext);

    return(
     <div className="chat">
        <div className="chatInfo">
            <span>{data.user?.displayName}</span>
            <div className="chatIcons">
                <img src="cam.svg" alt="" />
                <img src="add.svg" alt="" />
                <img src="more.svg" alt="" />
            </div>
        </div>
        <Messages/>
        <Input/>
     </div>
    )
 }
 
 export default Chat;