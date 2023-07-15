import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebase.config";
import { signOut as authSignOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
const UserContext=createContext({});

export const UserProvider=({children})=>{
    const [currentUser,setCurrentUser]=useState(null);    
    const [isLoading,setIsLoading]=useState(true);


    const signOut=()=>{
        authSignOut(auth).then(()=>clear());
    }
    
    const clear=async()=>{
        try {
            if(currentUser){
                await updateDoc(doc(db, "users", currentUser.uid), { isOnline: true });
            }
            
        } catch (error) {
            console.log(error);
        }

        // we are logging user out here so above the currentUser will exist 
        setCurrentUser(null);
        setIsLoading(false);
    }


    const authStateChanged=async (user)=>{
        setIsLoading(true);
        if(!user){
            clear();
            return; 
        }

        // check user online status 
        // find reference of document if it exists for current user.uid
        const userDocExist= await getDoc(doc(db,'users',user.uid));

        if(userDocExist.exists()){
            await updateDoc(doc(db,'users',user.uid),{isOnline:true});
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



