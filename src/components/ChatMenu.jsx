import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import ClickAwayListener from "react-click-away-listener";
import { db } from "../firebase/firebase.config";
import { useAuth } from "../context/authContext";
import { useChatContext } from "../context/chatContext";

const ChatMenu = ({ showMenu, setShowMenu }) => {
  
   const { currentUser } = useAuth();
   const { data,users } = useChatContext();

   
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
