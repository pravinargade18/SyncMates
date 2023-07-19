
import {  RiErrorWarningLine } from "react-icons/ri";
import { useAuth } from "../../context/authContext";
import { useChatContext } from "../../context/chatContext";
import PopupWrapper from "./PopupWrapper";

const DeleteMessagePopup = (props) => {
  const { currentUser } = useAuth();
  const { users, dispatch } = useChatContext();

  

  return (
    <PopupWrapper {...props}>
      <div className="mt-10 mb-5">
        <div className="flex items-center justify-center gap-3">
          <RiErrorWarningLine size={24} className="text-red-500" />
          <div className="text-lg">
            Are you sure, You want to delete message?
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => {}}
            className="border-[2px] border-red-700 py-2 px-4 text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
          >
            Delete for me
          </button>
          <button
            onClick={() => {}}
            className="border-[2px] border-red-700 py-2 px-4 text-sm rounded-md text-red-500 hover:bg-red-700 hover:text-white"
          >
            Delete for everyone
          </button>
          <button
            onClick={props.onHide}
            className="border-[2px] border-white py-2 px-4 text-sm rounded-md text-white hover:bg-white hover:text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </PopupWrapper>
  );
};

export default DeleteMessagePopup;
