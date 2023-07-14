import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import Loader from "../components/Loader";

const Home = () => {
  const navigate=useNavigate();
  const {signOut,isLoading,currentUser} = useAuth();

  useEffect(()=>{
    if(!isLoading && !currentUser) {
        navigate('/login'); 
    }
  },[isLoading,currentUser])

  return !currentUser ? (<Loader/>):(
    <button className="text-black" onClick={signOut}>Sign Out</button>

  )
}

export default Home;