import { useState } from 'react';
import {useNavigate, Link} from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";




const Login = () =>{
    const [err, setErr] = useState(false);  
    const navigate = useNavigate();

    const handleSubmit= async (event)=>{

        event.preventDefault()
        const email = event.target[0].value;
        const password = event.target[1].value;
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
          } catch (err) {
            setErr(true);   
          }
        
    }



    return(
        <div className="formContainer">

            <div className="formWrapper">
                <span className="logo">Baat-Cheet</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    
                    <button>Sign in</button>
                </form>
                {err && <span>An error occured</span>}
                <p>Not registered? <Link to="/register">Sign up</Link></p>
            </div>

        </div>
    )
}

export default Login;