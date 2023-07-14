import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import Loader from "../components/Loader";
import LeftNav from "../components/LeftNav";

const Home = () => {
  const navigate=useNavigate();
  const {signOut,isLoading,currentUser} = useAuth();

  useEffect(()=>{
    if(!isLoading && !currentUser) {
        navigate('/login'); 
    }
  },[isLoading,currentUser])

  return !currentUser ? (<Loader/>):(
    // <button className="text-black" onClick={signOut}>Sign Out</button>

    <div className="bg-c1 flex h-[100vh]">
      <div className="flex w-full shrink-0">
        <LeftNav/>
        <div className="flex bg-c2 grow">
          <div>Sidebar</div>
          <div>Chat</div>
        </div>
      </div>
    </div>

  )
}

export default Home;