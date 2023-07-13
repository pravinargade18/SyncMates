import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";

const Home = () => {
  const navigate=useNavigate();
  const {signOut,isLoading,currentUser} = useAuth();

  useEffect(()=>{
    if(!isLoading && !currentUser) {
        navigate('/login'); 
    }
  },[isLoading,currentUser])

  return (
    <button className="text-black" onClick={signOut}>Sign Out</button>
  )
}

export default Home;