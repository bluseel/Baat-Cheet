import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message, onEditMessage, onDeleteMessage }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState(message.text);
  const [clicked, setClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const messageDate = new Date(message.date?.seconds * 1000);
  const formattedTime = messageDate.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDateTime = `${formattedTime}`;

  const handleContentClick = () => {
    setClicked((prev) => !prev);

    // Show on 1st click, hide on 2nd click
    if (clicked) {
      setIsHovered(false);
    } else {
      setIsHovered(true);
    }
  };

  const handleMouseEnter = () =>{
    setIsHovered(true);
  }

  const handleMouseLeave = () =>{
    setIsHovered(false);
    
  }
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
  };

  const handleSaveClick = () => {
    onEditMessage({
      ...message,
      text: editedText,
    });
    setEditMode(false);
  };

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img
          src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
          alt=""
        />
        <span>{formattedDateTime}</span>
      </div>
      <div
        className="messageContent"
        onClick={handleContentClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {editMode ? (
          <>
            <textarea value={editedText} onChange={handleTextChange} />
            <button onClick={handleSaveClick}>Save</button>
          </>
        ) : (
          <>
            
            {message.text && <p> {message.text}</p>}
            {message.img && <img src={message.img} alt="" className="messageImage" />}
            {message.video && (
              <video width="320" height="240" controls>
                <source src={message.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {message.senderId === currentUser.uid && isHovered && (
              <>
                {message.text && <img src="pen.svg" onClick={toggleEditMode} className="penDelete" />}
                <img src="delete.svg" onClick={() => onDeleteMessage(message.id)} className="penDelete" alt="" />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
