import { useEffect, useState } from "react";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { profileColors } from "../utils/constants";


const gProvider = new GoogleAuthProvider();


const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();
  const { currentUser, isLoading } = useAuth();
  // console.log(name);
  useEffect(() => {
    if (!isLoading && currentUser) {
      // user loggedin
      navigate("/login");
    }
  }, [currentUser, isLoading]);

  const emailHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };
  const nameHandler = (e) => {
    setName(e.target.value);
  };



  const signInWithGoogleHandler = async () => {
    try {
      const { user } = await signInWithPopup(auth, gProvider);
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
const colorIndex=Math.floor(Math.random()* profileColors.length)
    try {
      const {user}=await createUserWithEmailAndPassword(auth,email,password);
      console.log(user);

      updateProfile(auth.currentUser, {
        displayName: name,
        
      });

      await setDoc(doc(db,"users",user.uid),{
        uid:user.uid,
        displayName:name,
       email: email,
       color:profileColors[colorIndex]
      })

      await setDoc(doc(db,"userChats",user.uid),{})

      
    } catch (error) {
      console.log(error);
    }
  }

  return isLoading || (!isLoading && currentUser) ? (
    <p className="text-black">Loading...</p>
  ) : (
    <div className="h-[100vh] flex justify-center items-center bg-c1">
      <div className="flex w-[520px]   items-center flex-col">
        <div className="text-center">
          <div className="text-4xl font-bold">Create New Account</div>
          <div className="mt-3 text-c3">
            Connect and chat with anyone, anywhere
          </div>
        </div>
        <div className="flex items-center gap-2 w-full mt-10 mb-5">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]">
            <div
              onClick={signInWithGoogleHandler}
              className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md"
            >
              <IoLogoGoogle size={24} />
              <span>Login with Google</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]">
            <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
              <IoLogoFacebook size={24} />
              <span>Login with Facebook</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-5 h-[1px] bg-c3"></span>
          <span className="text-c3 font-semibold ">OR</span>
          <span className="w-5 h-[1px] bg-c3"></span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-3 w-[520px] mt-5"
        >
          <input
            type="text"
            placeholder="Username"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
            value={name}
            onChange={nameHandler}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
            value={email}
            onChange={emailHandler}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-14 bg-c5 rounded-xl outline-none border-none px-5 text-c3"
            autoComplete="off"
            value={password}
            onChange={passwordHandler}
          />

          <div className="text-right w-full text-c3">
            <span className="cursor-pointer">Forgot Password?</span>
          </div>
          <button className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Sign Up
          </button>
        </form>
        <div className="flex justify-center gap-1 text-c3 mt-5">
          <span>Already have and account? </span>
          <Link
            to="/login"
            className="font-semibold text-white underline underline-offset-2 cursor-pointer"
          >
            {" "}
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
