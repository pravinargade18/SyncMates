import Icon from "./Icon";
import {CgAttachment} from 'react-icons/cg'
import {HiOutlineEmojiHappy} from 'react-icons/hi'
import ComposeBar from "./ComposeBar";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import ClickAwayListener from "react-click-away-listener";

const ChatFooter = () => {

    const [showEmojiPicker,setShowEmojiPicker] = useState(false);

    const emojiClickHandler=()=>{

    }

  return (
    <div className="flex items-center bg-c1/[0.5] p-2 relative rounded-xl ">
      <div className="shrink-0">
        <input
          type="file"
          id="fileUploader"
          className="hidden"
          onChange={() => {}}
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
          onClick={()=>setShowEmojiPicker(true)}
        />

        {showEmojiPicker && (
          <ClickAwayListener onClickAway={()=>setShowEmojiPicker(false)}>
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
      <ComposeBar />
    </div>
  );
}

export default ChatFooter;