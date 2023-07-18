import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { useChatContext } from "../context/chatContext";
import { useState } from "react";
import { db } from "../firebase/firebase.config";
import { useRef } from "react";
import Message from "./Message";

const Messages = () => {
    const [messages,setMessages]=useState([]);
    const {data}=useChatContext();

    const ref=useRef();  //needed this ref to keep the chat at the bottom

    useEffect(() => {
      const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        if (doc.exists()) {
          setMessages(doc.data().messages);
        }
      });
      return () => unsub();
    }, [data.chatId]);
  return (
    <div ref={ref} className="grow p-5 overflow-auto scrollbar flex flex-col">
        {messages.map((msg)=>{
          return (
            <Message message={msg} key={msg.id}/>
          )
        })}
        
    </div>
  )
}

export default Messages;