import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({message}) =>{

    const {currentUser} = useContext(AuthContext);
    const {data} = useContext(ChatContext);

    const ref =  useRef();

    useEffect(()=>{
        ref.current?.scrollIntoView({behavior:"smooth"});
    },[message])

    const messageDate = new Date(message.date?.seconds * 1000); // Convert from Firestore timestamp

    console.log(messageDate);

    const formattedDate = messageDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const formattedTime = messageDate.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const formattedDateTime = `${formattedTime}`;

    console.log(messageDate);    return (
        <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
            <div className="messageInfo">
                <img src={
                    message.senderId === currentUser.uid
                    ? currentUser.photoURL
                    : data.user.photoURL
                } alt="" />
                <span>{formattedDateTime}</span>
            </div>
            <div className="messageContent">
                <p>{message.text}</p>
                
                {message.img && <img src={message.img} alt="" />}
            </div>
        </div>
    )
}

export default Message;