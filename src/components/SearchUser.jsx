import { collection,  doc,  getDoc,  getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useState } from "react";
import {RiSearch2Line} from 'react-icons/ri';
import { db } from "../firebase/firebase.config";
import Avatar from "./Avatar";
import { useAuth } from "../context/authContext";
import { useChatContext } from "../context/chatContext";


const SearchUser = () => {

    const [username,setUsername]=useState('');
    const [user,setUser]=useState(null);
    const [error,setError]=useState(false);

    const {currentUser}= useAuth();
    const {dispatch}=useChatContext();

    const handleSelect = async () => {
      try {
        const combinedId =
          currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;

        const res = await getDoc(doc(db, "chats", combinedId));
        if (!res.exists()) {
          // chat doc doesn't exist for these combined id then create it
          await setDoc(doc(db, "chats", combinedId), { messages: [] });

          // as we have to update userChats collection for currentUser and other user as well
          const currentUserChatRef = await getDoc(
            doc(db, "userChats", currentUser.uid),
            {}
          );
          const userChatRef = await getDoc(doc(db, "userChats", user.uid), {});

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

            [combinedId + ".userInfo"]: {
              //nested data updating using . firebase docs ---> here it combinedId will be the key
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL || null,
              color: currentUser.color,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
        } else {
          // chat doc is exists for this combinedId
        }
            setUser(null);
            setUsername("");
        dispatch({ type: "CHANGE_USER", payload: user });
        // after selecting user close the userspopup
        
      } catch (error) {
        console.log(error);
      }
    };



    const usernameChangeHandler=(e)=>{
        setUsername(e.target.value);
    }
    const onKeyup=async (e)=>{
        // logic for search 
        // there is method in firebase docs to search particular document in a collection which can be found inside ---> perform simple and composed queries 
        if(e.code ==='Enter' &&  !!username){
            try {
                setError(false);
                const usersRef=collection(db,'users');
                const q=query(usersRef,where('displayName','==',username));

                const querySnapshot = await getDocs(q);
                if(querySnapshot.empty){
                    setError(true);
                    setUser(null);
                }
                else{
                    querySnapshot.forEach((doc)=>{
                        setUser(doc.data());
                    })
                }





            } catch (error) {
                console.log(error);
                setError(error);
            }
        }
    }
  return (
    <div className="shrink-0">
      <div className="relative">
        <RiSearch2Line className="absolute top-4 left-4 text-c3" />
        <input
          type="text"
          placeholder="Search user..."
          onChange={usernameChangeHandler}
          onKeyUp={onKeyup}
          value={username}
          autoFocus
          className="w-full h-12 rounded-xl bg-c1/[0.5] pl-11 pr-16 placeholder:text-c3 outline-none text-base"
        />
        <span className="absolute top-[14px] right-4 text-sm text-c3">
          Enter
        </span>
      </div>

      {/* if user doesn't exist  */}
      {error && (
        <>
          <div className="mt-5 w-full text-center text-sm">user not found!</div>
          <div className="w-full h-[1px] bg-white/[0.1] mt-5"></div>
        </>
      )}

      {/* if user exist  */}
      {user && (
        <>
          <div
            className="mt-5 flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 cursor-pointer"
            onClick={() => handleSelect(user)}
          >
            <Avatar size="large" user={user} />
            <div className="flex flex-col gap-1 grow">
              <span className="text-base text-white flex items-center justify-between">
                <div className="font-medium">{user.displayName}</div>
              </span>
              <p className="text-sm text-c3">{user.email}</p>
            </div>
          </div>

          <div className="w w-full h-[1px] bg-white/[0.1] mt-5"></div>
        </>
      )}
    </div>
  );
}

export default SearchUser;