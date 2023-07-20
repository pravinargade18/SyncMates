import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import ClickAwayListener from "react-click-away-listener";
import { db } from "../firebase/firebase.config";
import { useAuth } from "../context/authContext";
import { useChatContext } from "../context/chatContext";

const ChatMenu = ({ showMenu, setShowMenu }) => {
  
   const { currentUser } = useAuth();
   const { data, users,chats, setSelectedChat, dispatch } = useChatContext();

   
    const isUserBlocked = users[currentUser.uid].blockedUsers?.find(
      (u) => u === data.user.uid
    ); //in my blockedUsers do I have any users blocked

    const iAmBlocked = users[data.user.uid].blockedUsers?.find(
      (u) => u === currentUser.uid //in other user does it consists my id in blockedUsers
    );

         const closeMenuHandler = () => {
           setShowMenu(false);
         };


  const blockUserHandler = async (action) => {
    if (action === "block") {
      await updateDoc(doc(db, "users", currentUser.uid), {
        blockedUsers: arrayUnion(data.user.uid),
      });
    }

    if (action === "unblock") {
      await updateDoc(doc(db, "users", currentUser.uid), {
        blockedUsers: arrayRemove(data.user.uid),
      });
    }
  };

  
  const handleDelete=async()=>{
        try {
            const chatRef = doc(db, "chats", data.chatId);

            // Retrieve the chat document from Firestore
            const chatDoc = await getDoc(chatRef);

            // Create a new "messages" array that excludes the message with the matching ID
            const updatedMessages = chatDoc.data().messages.map((message) => {
                message.deleteChatInfo = {
                    ...message.deleteChatInfo,
                    [currentUser.uid]: true,
                };
                return message;
            });

            // Update the chat document in Firestore with the new "messages" array
            await updateDoc(chatRef, { messages: updatedMessages });

            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [data.chatId + ".chatDeleted"]: true,
            });

            const chatId = Object.keys(chats || {}).filter(
                (id) => id !== data.chatId
            );

            const filteredChats = Object.entries(chats || {})
                .filter(([id, chat]) => id !== data.chatId)
                .sort((a, b) => b[1].date - a[1].date);

            if (filteredChats.length > 0) {
                setSelectedChat(filteredChats[0][1].userInfo);
                dispatch({
                    type: "CHANGE_USER",
                    payload: filteredChats[0][1].userInfo,
                });
            } else {
                dispatch({ type: "EMPTY" });
            }
        } catch (err) {
            console.error(err);
        }

  }

  return (
    <ClickAwayListener onClickAway={closeMenuHandler}>
      <div className="w-[200px] absolute top-[70px] right-5 bg-c0 z-10 rounded-md overflow-hidden">
        <ul className="flex flex-col py-2">
          {!iAmBlocked && (
            <li
              onClick={(e) => {
                e.stopPropagation();
                blockUserHandler(isUserBlocked ? "unblock" : "block");
              }}
              className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
            >
              {isUserBlocked? 'Unblock user' : 'Block user'}
            </li>
          )}
          <li onClick={(e)=>{ 
            e.stopPropagation();
            handleDelete();
            setShowMenu(false);
            }} className="flex items-center py-3 px-5 hover:bg-black cursor-pointer">
            Delete chat
          </li>
        </ul>
      </div>
    </ClickAwayListener>
  );
};

export default ChatMenu;
