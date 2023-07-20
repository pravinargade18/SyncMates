import { useEffect, useRef, useState } from "react";
import { useChatContext } from "../context/chatContext";
import { Timestamp, collection, doc, getDoc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { RiSearch2Line } from "react-icons/ri";
import Avatar from "./Avatar";
import { useAuth } from "../context/authContext";
import { formatDate } from "../utils/helpers";

const Chats = () => {
  const { users, setUsers,resetFooterStates, chats, setChats, selectedChat, setSelectedChat ,dispatch,data} =
    useChatContext({});
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [unreadMsgs, setUnreadMsgs] = useState({});

  const isCodeBlockExecutedRef=useRef(false);
  const isUsersFetchedRef=useRef(false);

  useEffect(()=>{
      resetFooterStates();
  },[data?.chatId])




  const readChat=async(chatId)=>{
    const chatRef=doc(db,'chats',chatId);
    const chatDoc=await getDoc(chatRef);

    let updatedMessages=chatDoc.data().messages.map(m=>{
      if(m?.read===false){
          m.read=true;
      }
      return m;
    })

    await updateDoc(chatRef,{
      messages:updatedMessages
    })
  }

  const handleSelect=(user,selectedChatId)=>{
    setSelectedChat(user);
    dispatch({ type: "CHANGE_USER", payload: user });
    if(unreadMsgs?.[selectedChatId]?.length>0){
      readChat(selectedChatId);
    }
  }
  
  

  const filteredChats = Object.entries(chats || {}).filter(([,chat])=>chat?.userInfo?.displayName?.toLowerCase().includes(search?.toLowerCase()) || chat?.lastMessage?.text?.toLowerCase().includes(search?.toLowerCase())).sort((a,b)=>b[1].date-a[1].date) //it will give array of all users each inner array will consists data like ['xkbwT2TLVWVOfCeSOMFeTZCeVqg1mTUwYwO8o0gyL7snHDfFDifzXxr2', {date: ,userInfo:{}}]  -->also we need to sort all the array on the basis of date in descending order so that we can keep the chatting with most recent user above of all other users  array format -->0
// :"xkbwT2TLVWVOfCeSOMFeTZCeVqg1b6exUxrgeHRtiYNmc7zO9eQUZ483"
// 1: {date: _it, userInfo: {…}}


  // console.log(filteredChats);
  // console.log(Object.entries(chats || {}));

  useEffect(() => {
    //firebase docs--> 'get real time updates'
    const unsub=onSnapshot(collection(db, "users"), (snap) => {
      const updatedUsers = {};
      snap.forEach((doc) => {
        updatedUsers[doc.id] = doc.data();
        // console.log(doc.data());
      });
      setUsers(updatedUsers);

      if(!isCodeBlockExecutedRef.current){
        isUsersFetchedRef.current=true;  //users fetched
      }
    });
    return ()=>unsub();
  }, []);


  useEffect(() => {
    // get all the chats for currentUser with all other users
    //firebase docs--> 'get real time updates'

    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setChats(data);

          // this block should be executed only once when the application starts 
          if(!isCodeBlockExecutedRef.current && isUsersFetchedRef.current && users){
              const firstChat=Object.values(data).sort((a,b)=>b.date-a.date)[0];

              if(firstChat){
                const user=users[firstChat?.userInfo?.uid]; //users[id]

                handleSelect(user);
              }

              isCodeBlockExecutedRef.current=true; //block executed
              
          }
        }
      });
       return () => unsub();
    };

    // if currentUser available then only get chat data for currentUser
    currentUser.uid && getChats();
  }, [isCodeBlockExecutedRef.current,users]);



  useEffect(()=>{
      const documentIds=Object.keys(chats);
      if(documentIds.length===0){
        return;
      }

      const q=query(
        collection(db,'chats'),
        where('__name__','in',documentIds)  //tracking realtime changes of all the  documents
      )

      const unsub=onSnapshot(q,(snapshot)=>{
        let msgs={}  //all unread messages in key value pair
        snapshot.forEach((doc)=>{
          if(doc.id !==data.chatId){
            // unread messages of other chat documents not of selected chat

            msgs[doc.id]=doc.data().messages.filter((m)=>
                m?.read===false && m?.sender !==currentUser.uid

            );
          }

          Object.keys(msgs || {})?.map((c)=>{
            if(msgs[c]?.length<1){
              delete msgs[c];
            }
          }
          
          )
        });

        setUnreadMsgs(msgs);

      });

      return ()=> unsub();

  },[chats,selectedChat])
  
  
  return (
    <div className="flex flex-col h-full ">
      <div className="shrink-0 sticky -top-[20px] z-10 flex justify-center w-full bg-c2 py-5">
        <RiSearch2Line className="absolute top-9 left-12 text-c3" />
        <input
          type="text"
          onChange={(e) => {
            setSearch(e.target.value)
          }}
          placeholder="Search user..."
          value={search}
          className="w-[300px] h-12 rounded-xl bg-c1/[0.5] pl-11 pr-5 placeholder:text-c3 outline-none text-base"
        />
      </div>

      {/* user chats */}
      <ul className="flex flex-col w-full my-5 gap-[2px]">
          {/* if currentUser had chat with atleast one user  */}
          {Object.keys(users || {}).length > 0 && filteredChats?.map((chat)=>{

            {/* we need all info of the user like online status and all so we will find it in users collection by matching uid in filteredChat's current chat */}
            const user=users[chat[1].userInfo.uid] ;  //users[otherusers id]
            const timestamp = new Timestamp(  //firebase timestamp method -->object
              chat[1].date?.seconds,
              chat[1].date?.nanoseconds
            );

            const date=timestamp.toDate();
            {/* console.log(date) */}
            return (
              <li
                key={chat[0]}
                onClick={() => handleSelect(user, chat[0])}
                className={`h-[90px] flex items-center gap-4 rounded-3xl hover:bg-c1 p-4 cursor-pointer ${
                  selectedChat?.uid === user?.uid ? "bg-c1" : ""
                }`}
              >
                <Avatar size="x-large" user={user} />
                {/* other user and chat info  */}
                <div className="flex flex-col gap-1 grow relative">
                  <span className="text-base text-white flex items-center justify-between">
                    <div className="font-medium">{user?.displayName}</div>
                    <div className="text-c3 text-xs">{formatDate(date)}</div>
                  </span>
                  <p className="text-sm text-c3 line-clamp-1 break-all">
                    {chat[1]?.lastMessage?.text ||
                      (chat[1]?.lastMessage?.img && "🌄 Photo") ||
                      "Start conversation"}
                  </p>
                  {/* line-clamp-1 will show only one line and break the text after that n will show dots */}
                  {/* break all is if the single word is so long so it will show whole word without breaking so we need to break it using break all
                   */}
                  {!!unreadMsgs?.[chat[0]]?.length && (
                    <span className="absolute right-0 top-7 min-w-[20px] h-5 rounded-full bg-red-500 flex justify-center items-center text-sm ">
                      {unreadMsgs?.[chat[0]]?.length}
                    </span>
                  )}
                </div>
              </li>
            );
          }) }

        
      </ul>
    </div>
  );
}

export default Chats; 