import Messages from "./Messages"
import Input from "./Input"

const Chat = () =>{
    return(
     <div className="chat">
        <div className="chatInfo">
            <span>Jane</span>
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