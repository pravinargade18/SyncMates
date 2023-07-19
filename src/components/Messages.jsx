import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useChatContext } from "../context/chatContext";
import { useState } from "react";
import { db } from "../firebase/firebase.config";
import { useRef } from "react";
import Message from "./Message";
import { DELETED_FOR_ME } from "../utils/constants";
import { useAuth } from "../context/authContext";

const Messages = () => {
    const [messages,setMessages]=useState([]);
    const { data, setIsTyping } = useChatContext();
    const {currentUser}=useAuth();

    const ref=useRef();  //needed this ref to keep the chat at the bottom

    useEffect(() => {
      const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        if (doc.exists()) {
          setMessages(doc.data().messages);
          setIsTyping(doc.data()?.typing?.[data.user.uid] || false);
        }

        setTimeout(() => {
          scrollToBottom();
        },0);  //setTimeout executes only after all other code executes so it doesn't matters if we given 0 over there
      });
      return () => unsub();
    }, [data.chatId]);

    // for new chats it should scroll automatically 

    const scrollToBottom=()=>{
        const chatContainer=ref.current;
        chatContainer.scrollTop=chatContainer.scrollHeight;
    }
  return (
    <div ref={ref} className="grow p-5 overflow-auto scrollbar flex flex-col">
        {messages?.filter((m)=>{  //filter method for deleted and deleted for everyone message filteration
          return (m?.deletedInfo?.[currentUser.uid] !== DELETED_FOR_ME && !m.deletedInfo?.deletedForEveryone && !m?.deletedInfo?.[currentUser.uid]);
        })?.
          map((msg)=>{
          return (
            <Message message={msg} key={msg.id}/>
          )
        })}
        
    </div>
  )
}

export default Messages;