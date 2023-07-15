import { useAuth } from "../../context/authContext";
import { useChatContext } from "../../context/chatContext";
import Avatar from "../Avatar";
import PopupWrapper from "./PopupWrapper";

const UsersPopup = (props) => {

    const {currentUser}=useAuth();
    const {users} = useChatContext();
  return (
    <PopupWrapper {...props}>
            <div className="mt-5 flex flex-col gap-2 grow relative overflow-auto scrollbar">
                <div className="absolute w-full">
                    {users && Object.values(users).map((user,index)=>(
                        <div key={index} className="flex items-center gap-4 rounded-xl hover:bg-c5 py-2 px-4 cursor-pointer">
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