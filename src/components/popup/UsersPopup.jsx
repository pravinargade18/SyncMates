import { deleteField, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/authContext";
import { useChatContext } from "../../context/chatContext";
import Avatar from "../Avatar";
import PopupWrapper from "./PopupWrapper";
import { db } from "../../firebase/firebase.config";
import SearchUser from "../SearchUser";

const UsersPopup = (props) => {

    const {currentUser}=useAuth();
    const {users,dispatch} = useChatContext();

const handleSelect= async (user)=>{
        try {
            const combinedId= currentUser.uid > user.uid
                ? currentUser.uid + user.uid
                : user.uid + currentUser.uid;

                const res = await getDoc(doc(db,'chats',combinedId));
                if(!res.exists()){
                  // chat doc doesn't exist for these combined id then create it
                  await setDoc(doc(db, "chats", combinedId), { messages: [] });

                  // as we have to update userChats collection for currentUser and other user as well
                  const currentUserChatRef = await getDoc(
                    doc(db, "userChats", currentUser.uid),
                    {}
                  );
                  const userChatRef = await getDoc(
                    doc(db, "userChats", user.uid),
                    {}
                  );

                  // below code is for if documents for these users are not existing in userChats collection then we have to create it. This is basically to handle the error so that application do not break
                  if (!currentUserChatRef.exists()) {
                    await setDoc(doc(db, "userChats", currentUser.uid), {});
                  }
                  //    other users info in currentUsers document of userchats

                  await updateDoc(doc(db, "userChats", currentUser.uid), {
                    [combinedId + ".userInfo"]: {
                      uid: user.uid,
                      displayName: user.displayName,
                      photoURL: user.photoURL || null,
                      color: user.color,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                  });

                  if (!userChatRef.exists()) {
                    await setDoc(doc(db, "userChats", user.uid), {});
                  }

                  //    currentUsers info in other users document of userchats
                  await updateDoc(doc(db, "userChats", user.uid), {
                    // combinedId + ".userInfo": This creates a nested object with a key based on the value of combinedId concatenated with the string ".userInfo". The properties inside this object (uid, displayName, photoURL, color) are assigned values from the corresponding variables or data sources.

                    [combinedId + ".userInfo"]: {  //nested data updating using . firebase docs ---> here it combinedId will be the key 
                      uid: currentUser.uid,
                      displayName: currentUser.displayName,
                      photoURL: currentUser.photoURL || null,
                      color: currentUser.color,
                    },
                    [combinedId + ".date"]: serverTimestamp(),
                  });
                }
                else{
                    // chat doc is exists for this combinedId 
                    await updateDoc(doc(db, "userChats", currentUser.uid), {
                      [combinedId + ".chatDeleted"]: deleteField(),
                    });
                    
                }

                dispatch({ type: "CHANGE_USER", payload: user });
                // after selecting user close the userspopup
                props.onHide();
        } catch (error) {
            console.log(error);
        }
}

  return (
    <PopupWrapper {...props}>
            <SearchUser/>
            <div className="mt-5 flex flex-col gap-2 grow relative overflow-auto scrollbar">
                <div className="absolute w-full">
                    {users && Object.values(users).map((user,index)=>(
                        <div key={index} className="flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 cursor-pointer" onClick={()=>handleSelect(user)}>
                            <Avatar size='large' user={user}/>
                            <div className="flex flex-col gap-1 grow">
                                <span className="text-base text-white flex items-center justify-between">
                                    <div className="font-medium">{user.displayName}</div>

                                </span>
                                <p className="text-sm text-c3">{user.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
    </PopupWrapper>
  )
}

export default UsersPopup;