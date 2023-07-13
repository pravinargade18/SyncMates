import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import { signOut as authSignOut } from "firebase/auth";
const UserContext=createContext({});

export const UserProvider=({children})=>{
    const [currentUser,setCurrentUser]=useState(null);    
    const [isLoading,setIsLoading]=useState(true);


    const signOut=()=>{
        authSignOut(auth).then(()=>clear());
    }
    
    const clear=()=>{
        setCurrentUser(null);
        setIsLoading(false);
    }


    const authStateChanged=(user)=>{
        setIsLoading(true);
        if(!user){
            clear();
            return; 
        }

        setCurrentUser(user);
        setIsLoading(false);
    }
    
    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,authStateChanged);
        //authStateChanged is a method.
        return ()=>unsubscribe();
    },[])

    return (
        <UserContext.Provider value={{currentUser,setCurrentUser,isLoading,setIsLoading,signOut}}>
                {children}
        </UserContext.Provider>
    )
}

export const useAuth=()=> useContext(UserContext);



