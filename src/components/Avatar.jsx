
const Avatar = ({size,user,onClick}) => {

    const s=size==='small'?32: size==='medium'?36: size==='x-large'?56:size==='xx-large'?96:40;
     const c =
        size === "small"
            ? "w-8 h-8"
            : size === "medium"
            ? "w-9 h-9"
            : size === "large"
            ? "w-10 h-10"
            : size === "x-large"
            ? "w-14 h-14"
            : "w-24 h-24";
    const f =
        size === "x-large"
            ? "text-2xl"
            : size === "xx-large"
            ? "text-4xl"
            : "text-base";
  return (
    <div onClick={onClick} className={`${c} rounded-full flex items-center justify-center text-base shrink-0 relative`} style={{backgroundColor: user?.color}}>
        {user?.photoURL ?(
            
            <div className={`${c}  overflow-hidden rounded-full`}>
                <img src={user?.photoURL} alt="user" width={s} height={s}/>
            </div>
        ):(
            <div className={`uppercase font-semibold ${f}`}>
                {user?.displayName?.charAt(0)}
            </div>
        )}
    </div>
  )
}

export default Avatar;