import { TbSend } from "react-icons/tb";
import { useChatContext } from "../context/chatContext";
import { Timestamp, arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase.config";
import {v4 as uuid} from 'uuid';
import { useAuth } from "../context/authContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect } from "react";

let typingTimeout=null;

const ComposeBar = () => {
    const { inputText, setInputText, data, attachment, setAttachmentPreview, setAttachment,editMessage,setEditMessage } =
      useChatContext();
    const {currentUser} = useAuth();

    // to get the message we want edit inside composebar 

    useEffect(() => {
      setInputText(editMessage?.text || "");
    },[editMessage])

    if(typingTimeout){
      clearTimeout(typingTimeout);  //clearTimeout if it's already running
    }

    const typingHandler=async (e)=>{
        setInputText(e.target.value);
        await updateDoc(doc(db,'chats',data.chatId),{
          [`typing.${currentUser.uid}`]:true,
        })


        typingTimeout=setTimeout(async()=>{
           await updateDoc(doc(db,'chats',data.chatId),{
                [`typing.${currentUser.uid}`]:false,
            })

            typingTimeout=null;
        },500)
    }

    const handleEdit=async ()=>{

      const messageId=editMessage.id;

      const chatRef=doc(db,'chats',data.chatId);

      const chatDoc=await getDoc(chatRef);
        
        if (attachment) {
          // file uploading logic  --> firebase docs -->storage ->upload files
          const storageRef = ref(storage, `chatImages/${uuid()}`); //basically filename has to be given so we gave username

          const uploadTask = uploadBytesResumable(storageRef, attachment);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  //editing particular message using id
                  let updatedMessages=chatDoc.data().messages.map((message) => {
                    if (message.id === messageId) {
                      message.text = inputText;
                      message.img = downloadURL;
                    }
                    return message;
                  });
                  await updateDoc(chatRef,{messages:updatedMessages});
                }
              );
            }
          );
        }
        else{
            let updatedMessages = chatDoc.data().messages.map((message) => {
              if (message.id === messageId) {
                message.text = inputText;
              }
              return message;
            });
            await updateDoc(chatRef, { messages: updatedMessages });
        }
        
        setInputText('');  //set text to empty string after sending the message
        setAttachment(null);
        setAttachmentPreview(null);
        setEditMessage(null);
        
    }

    
    const onKeyUp = (e) => {
      if (e.key === "Enter" && (inputText || attachment)) {
            editMessage ? handleEdit() : handleSend();
      }
    };

    const handleSend=async ()=>{
        // console.log('hey called');
       

        if (attachment) {
          // file uploading logic  --> firebase docs -->storage ->upload files
          const storageRef = ref(storage, `chatImages/${uuid()}`); //basically filename has to be given so we gave username

          const uploadTask = uploadBytesResumable(storageRef, attachment);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  await updateDoc(doc(db, "chats", data.chatId), {
                    //firebase docs-->arrayUnion in fb is like array.push in js
                    messages: arrayUnion({
                      id: uuid(),
                      text: inputText,
                      sender: currentUser.uid,
                      date: Timestamp.now(),
                      read: false,
                      img:downloadURL,
                    }),
                  });
                }
              );
            }
          );
        }
        else{
          await updateDoc(doc(db, "chats", data.chatId), {
            //firebase docs-->arrayUnion in fb is like array.push in js
            messages: arrayUnion({
              id: uuid(),
              text: inputText,
              sender: currentUser.uid,
              date: Timestamp.now(),
              read: false,
            }),
          });
        }
        
        

        let msg={text:inputText};

        if (attachment) {  
          msg.img = true; //to check if last message is image then show in chats as img
        }
        // for current user 
        await updateDoc(doc(db,'userChats', currentUser.uid),{
          [data.chatId+".lastMessage"]:msg,
          // whenever new msg comes date should be updated 
          [data.chatId+".date"]:serverTimestamp(),
        })

        
        // for other user  
        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: msg,
          // whenever new msg comes date should be updated
          [data.chatId + ".date"]: serverTimestamp(),
        });
        setInputText('');  //set text to empty string after sending the message
        setAttachment(null);
        setAttachmentPreview(null);
    }




  return (
    <div className="flex items-center gap-2 grow">
      <input
        type="text"
        className="grow w-full outline-0 px-2 py-2 text-white bg-transparent placeholder:text-c3 outline-none text-base"
        placeholder="Type a message"
        value={inputText}
        onChange={typingHandler}
        onKeyUp={onKeyUp}
      />
      <button onClick={editMessage ? handleEdit: handleSend} className={`h-10 w-10 rounded-xl shrink-0 flex justify-center items-center ${inputText.trim().length>0 ? 'bg-c4' :''} `}>
        <TbSend size={20} className="text-white"/>
      </button>
    </div>
  );
}

export default ComposeBar;