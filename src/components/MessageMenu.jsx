import React, { useEffect, useRef } from "react";
import ClickAwayListener from "react-click-away-listener";

const MessageMenu = ({
  showMenu,
  setShowMenu,
  self,
  deletePopupHandler,
  setEditMessage,
}) => {
  const closeMenuHandler = () => {
    setShowMenu(false);
  };

  const ref = useRef();

  useEffect(() => {
    ref?.current?.scrollIntoViewIfNeeded();
    // in last chat if we open messageMenu it hides under composebar to fit it in view used scrollIntoViewIfNeeded
  }, [showMenu]);
  return (
    <ClickAwayListener onClickAway={closeMenuHandler}>
      <div
        ref={ref}
        className={`w-[200px] absolute  bg-c0 z-10 rounded-md overflow-hidden top-8 ${
          self ? "right-0" : "left-0"
        }`}
      >
        <ul className="flex flex-col py-2">
          {/* currentUser only can edit the message */}
          {self && (
            <li
              onClick={(e) => {
                e.stopPropagation();
                setEditMessage();
                setShowMenu(false);
              }}
              className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
            >
              Edit Message
            </li>
          )}

          <li
            onClick={(e) => {
              e.stopPropagation(); //to close the messageMenu
              deletePopupHandler(true);
            }}
            className="flex items-center py-3 px-5 hover:bg-black cursor-pointer"
          >
            Delete Message
          </li>
        </ul>
      </div>
    </ClickAwayListener>
  );
};

export default MessageMenu;
