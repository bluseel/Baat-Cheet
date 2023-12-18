import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid";

const Input = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [err, setErr] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSend = async () => {
    try {
      setIsUploading(true);

      // Check if there is at least text, an image, or a video
      if (!text && !file) {
        setErr(true);
        return;
      }

      if (file) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("Error uploading file:", error);
              setErr(true);
              reject(error);
            },
            async () => {
              try {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const messageType = file.type.startsWith("image/") ? "img" : "video";

                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    [messageType]: downloadURL,
                  }),
                });
                resolve();
              } catch (error) {
                console.error("Error getting download URL:", error);
                setErr(true);
                reject(error);
              }
            }
          );
        });
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }

      setErr(false);
    } catch (error) {
      console.error("Error in handleSend:", error);
      setErr(true);
    } finally {
      setIsUploading(false);
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setFile(null);
  };

  useEffect(() => {
    const sendButton = document.getElementById("sendButton");
    if (sendButton) {
      sendButton.disabled = isUploading || (!text && !file);
    }
  }, [isUploading, text, file]);

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type your message ...."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src="attach.svg" alt="" />
        </label>
        <button id="sendButton" onClick={handleSend} disabled={isUploading || (!text && !file)}>
          {isUploading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Input;
