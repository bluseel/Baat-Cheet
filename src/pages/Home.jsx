import Sidebar from "../components/Sidebar"
import Chat from "../components/Chat"
import { useState } from "react"


const Home = () =>{

    const [showSideBar, setShowSideBar] = useState(true);
    
   return(
    <div className="home">
        <div className="container">
            <Sidebar showSideBar={showSideBar} setShowSideBar={setShowSideBar}/>
            <Chat onStateChange={setShowSideBar}/>

            {console.log("hhhhh", showSideBar)}
        </div>
    </div>
   )
}

export default Home;