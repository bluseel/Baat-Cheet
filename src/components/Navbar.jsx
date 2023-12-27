import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile, signOut } from "firebase/auth";
import { auth } from "../firebase";

import { storage } from "../firebase";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);

  const handlePictureChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        // Set uploading to true to show loading indicator
        setUploading(true);

        // Create a unique image name
        const date = new Date().getTime();
        const storageRef = ref(storage, `${currentUser.displayName + date}`);

        // Upload the new image
        await uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
              // Update user's profile with the new photoURL
              await updateProfile(auth.currentUser, {
                photoURL: downloadURL,
              });

              // Set uploading to false to hide loading indicator
              setUploading(false);

            } catch (err) {
              console.error("Error updating profile:", err);
            }
          });
        });
      } catch (err) {
        console.error("Error uploading image:", err);

        // Set uploading to false in case of an error
        setUploading(false);
      }
    }
  };

  return (
    <div className="navbar">
      {/* <span className="logo">Pegaam</span> */}
      <div className="user">
        <input
          type="file"
          id="picture"
          style={{ display: "none" }}
          onChange={handlePictureChange}
        />

        <label htmlFor="picture">
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={currentUser.photoURL} alt="" />
            {uploading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.7)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span>Loading...</span>
              </div>
            )}
          </div>
        </label>

        <span>{currentUser.displayName}</span>
        <button onClick={()=>{signOut(auth)}}>Sign out</button>
      </div>
    </div>
  );
};

export default Navbar;
