import {BiCheck, BiEdit} from 'react-icons/bi'
import Avatar from './Avatar';
import { useAuth } from '../context/authContext';
import Icon from './Icon';
import {FiPlus} from 'react-icons/fi';
import { TbLogout } from "react-icons/tb";
import { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdAddAPhoto, MdDeleteForever, MdPhotoCamera,  } from "react-icons/md";
import {profileColors}  from '../utils/constants'
import { toast } from "react-toastify";
import ToastMessage from "../components/ToastMessage";
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase/firebase.config';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import UsersPopup from './popup/UsersPopup';
UsersPopup;




const LeftNav = () => {

    const [editProfile,setEditProfile] = useState(false);
    const [nameEdited,setNameEdited] = useState(false);
    const [usersPopup,setUsersPopup] = useState(false);

    const {currentUser,signOut,setCurrentUser}=useAuth();

  const userPopupHandler=()=>{
    setUsersPopup((usersPopup)=>!usersPopup)
  }
  const hideUserPopupHandler = () => {
    setUsersPopup((usersPopup) => !usersPopup);
  };
    //image upload to firestore

     const uploadImageToFirestore =(file)=>{
        try {
            if(file){
              // file uploading logic  --> firebase docs -->storage ->upload files
                const storageRef = ref(storage, `images/${currentUser.displayName}`);  //basically filename has to be given so we gave username

                const uploadTask = uploadBytesResumable(storageRef, file);

                uploadTask.on(
                  "state_changed",
                  (snapshot) => {
                    const progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    switch (snapshot.state) {
                      case "paused":
                        console.log("Upload is paused");
                        break;
                      case "running":
                        console.log("Upload is running");
                        break;
                    }
                  },
                  (error) => {
                    console.log(error);
                  },
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                      async (downloadURL) => {  //async added as updateprofile is used
                        console.log("File available at", downloadURL);
                       
                        handleUpdateProfile('photo',downloadURL);
                         await updateProfile(auth.currentUser, {
                           photoURL: downloadURL,
                          });

                      }
                    );
                  }
                );
            }
        } catch (error) {
          console.log(error);
        }
     }

    const handleUpdateProfile = (type,value)=>{
        //types-->color, photo ,remove photo ,change name

        let user={...currentUser};

        switch(type){
            case "color":
              user.color=value;
              break;

            case "name":
              user.displayName=value;
              break;

            case "photo":
              user.photoURL=value;
              break;

            case "photo-remove":
              user.photoURL=null;  //if photo is remove make photo as null
              break;

            default:
              break;
        }

        try {
          toast.promise(
            async () => {
              // our logic -->firebase docs
             const userDocRef= doc(db,'users',currentUser.uid);
             await updateDoc(userDocRef,user);
             setCurrentUser(user);   //updating local state of user

             if(type==='photo-remove'){
                await updateProfile(auth.currentUser,{
                  photoURL:null
                })
             }
             if(type==='name'){
                await updateProfile(auth.currentUser,{
                  displayName:value
                })
                setNameEdited(false);
             }
             
            },
            {
              pending: "Updating profile...",
              success: "Profile updated successfully!",
              error: "Profile updation failed!",
            },
            {
              autoClose: 3000,
            }
          );
        } catch (error) {
          console.log(error);
        }

    }

    const onKeyUp = (e) => {
      if(e.target.innerText.trim() !== currentUser.displayName){
          // name is edited  
          setNameEdited(true);
      }
      else{
        // name is not edited 
        setNameEdited(false); 
      }
    }
    const onKeyDown = (e) => {
      if(e.key === 'Enter' && e.keyCode === 13){
          // name is edited  
          e.preventDefault();  //preventing default behaviour of new line on enter key 
      }
     
    }


    const editProfileContainer=()=>{
      return (
        <div className="relative flex flex-col items-center">
          <ToastMessage />
          <Icon
            size="small"
            className="absolute top-0 right-5  hover:bg-c2"
            icon={<IoMdClose size={20} />}
            onClick={() => setEditProfile(false)}
          />
          <div className="relative group cursor-pointer">
            <Avatar
              size="xx-large"
              user={currentUser}
              onClick={() => setEditProfile(true)}
            />
            <div className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex">
              <label htmlFor="fileUpload">
                {currentUser.photoURL ? (
                  <MdPhotoCamera size={34} />
                ) : (
                  <MdAddAPhoto size={34} />
                )}
              </label>
              <input
                id="fileUpload"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => 
                    uploadImageToFirestore(e.target.files[0])
                }
              />
            </div>
            {currentUser?.photoURL && (
              <div onClick={()=>handleUpdateProfile('photo-remove')} className="w-6 h-6 rounded-full bg-red-500 flex justify-center items-center absolute right-0 bottom-0">
                <MdDeleteForever size={14} />
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col items-center">
            <div className="flex items-center gap-2">
              {!nameEdited && <BiEdit className="text-c3" />}
              {nameEdited && (
                <BsFillCheckCircleFill
                  className="text-c4 cursor-pointer"
                  onClick={() => {
                    //name change logic
                    const value =
                      document.getElementById("displayNameEdit").innerText;
                    handleUpdateProfile("name", value);
                  }}
                />
              )}
              <div
                contentEditable
                className="bg-transparent outline-none border-none text-center"
                id="displayNameEdit"
                onKeyUp={onKeyUp}
                onKeyDown={onKeyDown}
              >
                {currentUser?.displayName}
              </div>
            </div>

            <span className="text c-3 text-sm">{currentUser?.email}</span>
          </div>

          {/* profile colors */}
          <div className="grid grid-cols-5 gap-4 mt-5">
            {profileColors.map((color, index) => (
              <span
                key={index}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
                style={{ backgroundColor: color }}
                onClick={() => {
                  handleUpdateProfile("color", color);
                }}
              >
                {color === currentUser?.color && <BiCheck size={24} />}
              </span>
            ))}
          </div>
        </div>
      );
    }

  return (
    <div
      className={`${
        editProfile ? " w-[350px] " : "w-[80px] items-center"
      } flex flex-col justify-between py-5 shrink-0 transition-all`}
    >
      {editProfile ? 
       editProfileContainer()
       : (
        <div className="relative group cursor-pointer">
          <Avatar size="large" user={currentUser} />
          <div
            onClick={() => {
              setEditProfile(true);
            }}
            className="w-full h-full rounded-full bg-black/[0.5] absolute top-0 left-0 justify-center items-center hidden group-hover:flex"
          >
            <BiEdit size={14} />
          </div>
        </div>
      )}

      <div
        className={`flex gap-5 ${
          editProfile ? "ml-5" : "flex-col items-center"
        }  `}
      >
        <Icon
          size="x-large"
          className="bg-green-500 hover:bg-green-600"
          icon={<FiPlus size={24} />}
          onClick={userPopupHandler}
        />
        <Icon
          size="x-large"
          className="hover:bg-c2"
          icon={<TbLogout size={24} />}
          onClick={signOut}
        />
      </div>
     {usersPopup && <UsersPopup title='Find user' onHide={hideUserPopupHandler} />}
    </div>
  );
}

export default LeftNav;