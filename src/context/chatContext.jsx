import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useAuth } from "./authContext";
import { useReducer } from "react";


const chatContext=createContext();



export const ChatContextProvider=({children})=>{

    const [users,setUsers]=useState(false);
    const [chats,setChats]=useState([]);
    const [selectedChat,setSelectedChat]=useState(null);

    const [inputText,setInputText]=useState("");
    const [attachment,setAttachment]=useState(null);
    const [attachmentPreview,setAttachmentPreview]=useState(null);
    const [editMessage,setEditMessage]=useState(null);
    const [isTyping,setIsTyping]=useState(null);
    const [imageViewer,setImageViewer]=useState(null);


    const {currentUser}=useAuth();

  const INITIAL_STATE = { chatId: "", user: null };
    const chatReducer = (state, action) => {
      switch (action.type) {
        case "CHANGE_USER":
          return {
            user: action.payload,
            chatId:
              currentUser.uid > action.payload.uid
                ? currentUser.uid + action.payload.uid
                : action.payload.uid + currentUser.uid,
          };
        case "EMPTY":
          return INITIAL_STATE;
        default:
          return state;
      }
    };
    
    const [state,dispatch]=useReducer(chatReducer, INITIAL_STATE);
    return (
      <chatContext.Provider
        value={{
          users,
          setUsers,
          dispatch,
          chats,
          data: state,
          setChats,
          selectedChat,
          setSelectedChat,
          inputText,
          setInputText,
          attachment,
          setAttachment,
          attachmentPreview,
          setAttachmentPreview,
          editMessage,
          setEditMessage,
          isTyping,
          setIsTyping,
          imageViewer,
          setImageViewer,
        }}
      >
        {children}
      </chatContext.Provider>
    );
}

export const useChatContext=()=>useContext(chatContext);