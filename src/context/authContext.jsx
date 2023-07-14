import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase.config";
import { signOut as authSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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


    const authStateChanged=async (user)=>{
        setIsLoading(true);
        if(!user){
            clear();
            return; 
        }
        const userDoc=await getDoc(doc(db,'users',user.uid));
        setCurrentUser(userDoc.data());  //data() gives all the data/object stored in collection
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



