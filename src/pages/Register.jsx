import {createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import {db, auth, storage} from "../firebase";
import { useState } from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import {useNavigate, Link} from "react-router-dom";


const Register = () =>{
    const [err, setErr] = useState(false);  
    const navigate = useNavigate();

    const handleSubmit= async (event)=>{
        event.preventDefault()
        const displayName = event.target[0].value;
        const email = event.target[1].value;
        const password = event.target[2].value;
        const file = event.target[3].files[0];
   
        try {
            //Create user
            const res = await createUserWithEmailAndPassword(auth, email, password);
      
            //Create a unique image name
            const date = new Date().getTime();
            const storageRef = ref(storage, `${displayName + date}`);
      
            await uploadBytesResumable(storageRef, file).then(() => {
              getDownloadURL(storageRef).then(async (downloadURL) => {
                try {
                  //Update profile
                  await updateProfile(res.user, {
                    displayName,
                    photoURL: downloadURL,
                  });
                  //create user on firestore
                  await setDoc(doc(db, "users", res.user.uid), {
                    uid: res.user.uid,
                    displayName,
                    email,
                    photoURL: downloadURL,
                  });
      
                  //create empty user chats on firestore
                  await setDoc(doc(db, "userChats", res.user.uid), {});
                  navigate("/");
        
                } catch (err) {
                  console.log(err);
                  setErr(true);
                  setLoading(false);
                }
              });
            });
          } catch (err) {
            setErr(true);
            console.log(err);
          }
        
    }

        
    
    return(
        <div className="formContainer">

            <div className="formWrapper">
                <span className="logo">Baat-Cheet</span>
                <span className="title">Sign up</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Display Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    
                    <input type="file" id="picture" style={{display:"none"}}/>
                    <label htmlFor="picture">
                        <img src="picture-sample.svg" alt="" />
                        <span>Add profile picture</span>
                    </label>

                    <button>Sign Up</button>
                </form>
                {err && <span>An error occured</span>}
                <p>Already registered? <Link to="/login">Sign in</Link></p>
            </div>

        </div>
    )
}

export default Register;