import { useAuth } from "../context/authContext";
import { useChatContext } from "../context/chatContext";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";

const Chat = () => {

    const { currentUser } = useAuth();
    const { data, users } = useChatContext();

    

    const isUserBlocked = users[currentUser.uid].blockedUsers?.find(
      (u) => u === data.user.uid
    ); //in my blockedUsers do I have any users blocked

    const iAmBlocked = users[data.user.uid].blockedUsers?.find(
      (u) => u === currentUser.uid //in other user does it consists my id in blockedUsers
    );

  return (
    <div className="flex flex-col p-5 grow">
      <ChatHeader />
      {data.chatId && <Messages />}
      {!isUserBlocked && !iAmBlocked && <ChatFooter />}
      {isUserBlocked && (
        <div className="w-full text-center text-c3 py-5 text-red-500">
          This user has been blocked!
        </div>
      )}
      {iAmBlocked && (
        <div className="w-full text-center text-c3 py-5 text-red-500">{`${data.user.displayName} has blocked you! `}</div>
      )}
    </div>
  );
}

export default Chat;