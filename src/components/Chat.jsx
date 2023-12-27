import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { useContext, useState } from "react";

const Chat = (props) => {
  const { data } = useContext(ChatContext);
  const [sidebarShown, setSidebarShown] = useState(false);

  const handleMenu = () => {
    props.onStateChange((prev) => {
      setSidebarShown(prev);
      return !prev;
    });
  };

  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chatUserInfo">
          <img src={data.user ? data.user.photoURL : ""} alt="" />
          <p>{data.user ? data.user.displayName : ""}</p>
        </div>
        <div className="chatIcons">
          <img
            src={sidebarShown ? "hamburger.svg" : "cross.svg"}
            className="mobileInteface"
            onClick={handleMenu}
            style={{zIndex:100}}
            alt=""
          />
        </div>

      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
