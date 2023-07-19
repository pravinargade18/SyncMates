import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/authContext";
import { useChatContext } from "../context/chatContext";
import Avatar from "./Avatar";
import ImageViewer from 'react-simple-image-viewer'
import { formatDate, wrapEmojisInHtmlTag } from "../utils/helpers";
import { useState } from "react";
import Icon from "./Icon";
import {GoChevronDown} from 'react-icons/go'
import MessageMenu from "./MessageMenu";
import DeleteMessagePopup from "./popup/DeleteMessagePopup";
import { db } from "../firebase/firebase.config";
import { DELETED_FOR_EVERYONE, DELETED_FOR_ME } from "../utils/constants";


const Message = ({ message }) => {
  const { users, data, imageViewer, setImageViewer } = useChatContext();
  const { currentUser } = useAuth();
  const self = message?.sender === currentUser.uid;

  const [showMenu,setShowMenu]=useState(false);
  const [showDeletePopup,setShowDeletePopup]=useState(false);


  const timestamp = new Timestamp( //firebase timestamp method -->object
   message.date?.seconds,
    message.date?.nanoseconds
  );

  const deletePopupHandler=()=>{
    setShowDeletePopup(true);  //show popup
    setShowMenu(false);  //close menu
  }



  // delete message 
  const deleteMessage=async(action)=>{

    try {
      const messageId=message.id;
      const chatRef=doc(db,'chats',data.chatId);

      const chatDoc=await getDoc(chatRef);

      const updatedMessages=chatDoc.data().messages.map((message)=>{
        if(message.id===messageId){
          if(action===DELETED_FOR_ME){
            message.deletedInfo={
              [currentUser.uid]:DELETED_FOR_ME,
            }
          }
          if(action===DELETED_FOR_EVERYONE){
            message.deletedInfo={
              deletedForEveryone:true,
            }
          }
        }
        return message;
      })
      //after changing the message array in document 'chats' we will update the messages array
      await updateDoc(chatRef,{messages:updatedMessages});
      setShowDeletePopup(false);
    } catch (error) {
      console.log(error);
    }
    
  }


  const date = timestamp.toDate();
  
  return (
    <div className={`mb-5 max-w-[75%] ${self ? "self-end" : ""}`}>
      {showDeletePopup && (
        <DeleteMessagePopup
          noHeader={true}
          onHide={() => setShowDeletePopup(false)}
          shortHeight={true}
          self={self}
          className="DeleteMessagePopup"
          deleteMessage={deleteMessage}
        />
      )}
      <div
        className={`flex items-end gap-3 mb-1  ${
          self ? "justify-start flex-row-reverse" : ""
        }`}
      >
        <Avatar
          size="small"
          user={self ? currentUser : users[data.user.uid]}
          className="mb-4"
        />
        <div
          className={`group flex flex-col gap-4 p-4 rounded-3xl relative break-all ${
            self ? "rounded-br-md bg-c5 " : "rounded-bl-md bg-c1"
          }`}
        >
          {message.text && (
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: wrapEmojisInHtmlTag(message?.text), //we used wrapEmojisInHtmlTag to style only emoji's seperately which is helper function in helper.js
              }}
            >
              {/* {message?.text} */}
              {/* we want to add show emojis little bigger than regular text to do that use dangerouslySetInnerHTML */}
            </div>
          )}

          {message?.img && (
            <>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/chatapp-26cff.appspot.com/o/images%2F705f0757-8c63-4d4f-b8d6-3ac7ff084845?alt=media&token=4055dd61-755c-4ecf-909a-29295985bebd"
                width={250}
                height={250}
                alt={message?.text || ""}
                className="rounded-3xl max-w-[250px]"
                onClick={() => {
                  setImageViewer({
                    msgId: message.id,
                    url: message.img,
                  });
                }}
              />

              {imageViewer && imageViewer?.msgId === message?.id && (
                <ImageViewer
                  src={[imageViewer.url]} //it takes array of images
                  currentIndex={0}
                  disableScroll={false}
                  closeOnClickOutside={true}
                  onClose={() => setImageViewer(null)}
                />
              )}
            </>
          )}
          <div
            className={`${
              showMenu ? "" : "hidden"
            } group-hover:flex absolute top-2 ${
              self ? "left-2 bg-c5 " : "right-2 bg-c1"
            } `}
            onClick={() => setShowMenu(true)}
          >
            <Icon
              size="medium"
              className="hover:bg-inherit rounded-none  "
              icon={<GoChevronDown size={24} className="text-c3" />}
            />
            {showMenu && (
              <MessageMenu
                self={self}
                setShowMenu={setShowMenu}
                showMenu={showMenu}
                deletePopupHandler={deletePopupHandler}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`flex items-end ${
          self ? "justify-start flex-row-reverse mr-12 " : "ml-12"
        }`}
      >
        <div className="text-xs text-c3">{formatDate(date)}</div>
      </div>
    </div>
  );
};

export default Message;
