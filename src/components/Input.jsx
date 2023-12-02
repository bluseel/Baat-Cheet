import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [err, setErr] = useState(false);

  const handleSend = async () => {
    try {
      if (img) {
        // Create a reference to a new storage object with a unique ID (UUID)
        const storageRef = ref(storage, uuid());

        // Upload the image to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, img);

        // Handle errors during the upload process
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            // TODO: Handle the upload error (e.g., setErr(true))
            console.error("Error uploading image:", error);
            setErr(true);
          },
          async () => {
            try {
              // When the upload is successful, get the download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

              // Update the Firestore document with the new message including the image URL
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            } catch (error) {
              // Handle the getDownloadURL error (e.g., setErr(true))
              console.error("Error getting download URL:", error);
              setErr(true);
            }
          }
        );
      } else {
        // If no image is selected, update the Firestore document with a text message
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }

     
      setErr(false); // Reset the error state
    } catch (error) {
      // Handle unexpected errors (e.g., setErr(true))
      console.error("Error in handleSend:", error);
      setErr(true);
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

      

      // Reset text and image states
      setText("");
      setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type your message ...."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src="picture-sample.svg" alt="" />
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src="attach.svg" alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input;
