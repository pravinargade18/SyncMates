import {  GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useEffect, useState } from 'react';
import {IoLogoGoogle, IoLogoFacebook} from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase.config';
import { useAuth } from '../context/authContext';
import ToastMessage from '../components/ToastMessage';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
// import MainLoader from '../components/MainLoader';


const gProvider=new GoogleAuthProvider();


const Login = () => {

  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate=useNavigate();
  const {currentUser,isLoading}=useAuth();



  useEffect(()=>{
      if(!isLoading && currentUser){
        // user loggedin 
        navigate('/');
      }
  },[currentUser,isLoading]);


  const emailHandler=(e)=>{
    setEmail(e.target.value)
  }
  const passwordHandler=(e)=>{
    setPassword(e.target.value)
  }


  const resetPassword=async()=>{
    try {
      toast.promise(
        async () => {
        // our logic 
        await sendPasswordResetEmail(auth,email);

      }, {
        pending: "Generating reset link",
        success: "Email reset link send to your registered email",
        error: " You may have entered wrong email id",
      },{
        autoClose:5000
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  const signInWithGoogleHandler=async()=>{
    try {
    const {user} = await signInWithPopup(auth, gProvider);
      console.log(user);
    } catch (error) {
      console.log(error);
    }
     

  }

  const formSubmitHanlder= async (e)=>{
      e.preventDefault();

      try {
        const {user}=await signInWithEmailAndPassword(auth,email,password);

        console.log(user)
        setEmail('');
        setPassword('');
      } catch (error) {
        console.log(error);
      }

  }
  return isLoading || (!isLoading && currentUser) ?(
    <Loader/>
    // <MainLoader/>
  ):(
    <div className="h-[100vh] flex justify-center items-center bg-c1">
    <ToastMessage/>
      <div className="flex w-[520px]   items-center flex-col">
        <div className="text-center">
          <div className="text-4xl font-bold">Login to Your Account</div>
          <div className="mt-3 text-c3">
            Connect and chat with anyone, anywhere
          </div>
        </div>
        <div className="flex items-center gap-2 w-full mt-10 mb-5">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full h-14 rounded-md cursor-pointer p-[1px]">
            <div onClick={signInWithGoogleHandler} className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
              <IoLogoGoogle size={24} />
              <span>Login with Google</span>
            </div>
          </div>
          {/* <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-1/2 h-14 rounded-md cursor-pointer p-[1px]">
            <div className="flex items-center justify-center gap-3 text-white font-semibold bg-c1 w-full h-full rounded-md">
              <IoLogoFacebook size={24} />
              <span>Login with Facebook</span>
            </div>
          </div> */}
        </div>
        <div className="flex items-center gap-1">
          <span className="w-5 h-[1px] bg-c3"></span>
          <span className="text-c3 font-semibold ">OR</span>
          <span className="w-5 h-[1px] bg-c3"></span>
        </div>

        <form onSubmit={formSubmitHanlder} className="flex flex-col items-center gap-3 w-[520px] mt-5">
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
            <span onClick={resetPassword} className="cursor-pointer">Forgot Password?</span>
          </div>
          <button className="mt-4 w-full h-14 rounded-xl outline-none text-base font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Login to Your Account
          </button>
        </form>
        <div className="flex justify-center gap-1 text-c3 mt-5">
          <span>Not a member yet? </span>
          <Link to="/register" className="font-semibold text-white underline underline-offset-2 cursor-pointer"> Register Now</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;