import Icon from "./Icon";
import {CgAttachment} from 'react-icons/cg'
import {HiOutlineEmojiHappy} from 'react-icons/hi'
import ComposeBar from "./ComposeBar";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { useChatContext } from "../context/chatContext";
import { IoClose } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";

const ChatFooter = () => {

    const [showEmojiPicker,setShowEmojiPicker] = useState(false);
    const {
      editMessage,
      setEditMessage,
      isTyping,
      setAttachment,
      inputText,
      setInputText,
      attachmentPreview,
      setAttachmentPreview,
    } = useChatContext();
    const emojiClickHandler=(emojiData)=>{
            // when we click on emoji we get emojidata and event 
            // console.log(emojiData.emoji);
            let text = inputText;
            setInputText((text += emojiData.emoji))
    }

    const onFileChange = (e)=>{
        const file=e.target.files[0];
        setAttachment(file);

        // to show preview 
        if(file){
            const blobUrl=URL.createObjectURL(file);  //it gives file url 
            console.log(blobUrl);
            setAttachmentPreview(blobUrl);
        }
    }

  return (
    <div className="flex items-center bg-c1/[0.5] p-2 relative rounded-xl ">
      {attachmentPreview && (
        <div className="absolute w-[100px] h-[100px] bottom-16 left-0 bg-c1 p-2 rounded-md">
          <img src={attachmentPreview} alt="file" />
          <div className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute -right-2 -top-2 cursor-pointer">
            <MdDeleteForever
              size={14}
              onClick={() => {
                setAttachment(null);
                setAttachmentPreview(null);
              }}
            />
          </div>
        </div>
      )}
      <div className="shrink-0">
        <input
          type="file"
          id="fileUploader"
          className="hidden"
          onChange={onFileChange}
        />
        <label htmlFor="fileUploader">
          <Icon
            size="large"
            icon={<CgAttachment size={20} />}
            className="text-c3"
          />
        </label>
      </div>
      <div className="shrink-0 relative">
        <Icon
          size="large"
          className={``}
          icon={<HiOutlineEmojiHappy size={24} className="text-c3" />}
          onClick={() => setShowEmojiPicker(true)}
        />

        {showEmojiPicker && (
          <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
            <div className="absolute bottom-12 left-0 shadow-lg">
              <EmojiPicker
                emojiStyle="native"
                theme="light"
                onEmojiClick={emojiClickHandler}
                autoFocusSearch={false}
              />
            </div>
          </ClickAwayListener>
        )}
      </div>
      {isTyping && (
        <div className="absolute -top-6 left-4 bg-c2 w-full h-6">
          <div className="flex gap-2 w-full h-full opacity-50 text-sm text-white">
            {`user is typing`}
            <img src="/typing.svg" alt="typing" />
          </div>
        </div>
      )}

      {editMessage && (
        <div
          onClick={() => setEditMessage(null)}
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-c4 flex items-center gap-2 py-2 px-4 pr-2 rounded-full text-sm font-semibold cursor-pointer shadow-lg"
        >
          <span size={20} className="text-white">
            Cancel edit
          </span>
          <IoClose />
        </div>
      )}
      <ComposeBar />
    </div>
  );
}

export default ChatFooter;