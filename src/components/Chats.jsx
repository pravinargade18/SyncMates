import { useEffect } from "react";
import { useChatContext } from "../context/chatContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

const Chats = () => {

    const {users,setUsers}=useChatContext({});
    useEffect(()=>{
        //firebase docs--> 'get real time updates' 
        onSnapshot(collection(db,'users'),(snap)=>{
            const updatedUsers={};
            snap.forEach((doc)=>{
                updatedUsers[doc.id]=doc.data();
                // console.log(doc.data());

            })
            setUsers(updatedUsers);
        })
    },[])
    
  return (
    <div>chats</div>
  )
}

export default Chats; 