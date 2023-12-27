import { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  const handleEditMessage = async (editedMessage) => {
    const chatRef = doc(db, "chats", data.chatId);
    const editedIndex = messages.findIndex((m) => m.id === editedMessage.id);
    const updatedMessages = [...messages];
    updatedMessages[editedIndex] = editedMessage;

    await updateDoc(chatRef, {
      messages: updatedMessages,
    });
  };

  const handleDeleteMessage = async (deletedMessageId) => {
    const chatRef = doc(db, "chats", data.chatId);
    const updatedMessages = messages.filter((m) => m.id !== deletedMessageId);

    await updateDoc(chatRef, {
      messages: updatedMessages,
    });
  };

  return (
    <div className="messages">
      { messages.length === 0?
        <div className="emptyMessages" style={{display:"flex", justifyContent:"center"}}>
          <img src="bird.png" />
          <p>Nothing to see here. Start chatting!</p>

        </div>
      :
        (messages.map((m) => (
          <Message
            key={m.id}
            message={m}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
          />
        )))
      
      }
    </div>
  );
};

export default Messages;