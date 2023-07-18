import { TbSend } from "react-icons/tb";
import { useChatContext } from "../context/chatContext";
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase.config";
import {v4 as uuid} from 'uuid';
import { useAuth } from "../context/authContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";


const ComposeBar = () => {
    const { inputText, setInputText, data, attachment, setAttachmentPreview, setAttachment} =
      useChatContext();
    const {currentUser} = useAuth();

    const typingHandler=(e)=>{
        setInputText(e.target.value);
    }


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


    const onKeyUp = (e) => {
        if (e.key === "Enter" && (inputText || attachment)) {
          handleSend();
        }

    };


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
      <button onClick={handleSend} className={`h-10 w-10 rounded-xl shrink-0 flex justify-center items-center ${inputText.trim().length>0 ? 'bg-c4' :''} `}>
        <TbSend size={20} className="text-white"/>
      </button>
    </div>
  );
}

export default ComposeBar;