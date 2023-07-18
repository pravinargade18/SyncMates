import moment from "moment";
export const formatDate=(date)=>{
    const now=new Date();
    const diff= now.getTime()-date.getTime();

    if(diff<60000){
        return 'now';
    }
    if(diff<3600000){
        return `${Math.round(diff/60000)} min ago`
    }
    if(diff < 86400000){ //less than a day
        return moment(date).format("h:mm A")
    }

    return moment(date).format("MM/DD/YY")

}

// stackoverflow 
export const wrapEmojisInHtmlTag = (messageText) => {
  const regexEmoji = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu; // regex to match all Unicode emojis
  return messageText.replace(regexEmoji, (match) => {
    return `<span style="font-size:1.2em;position:relative;top:2px">${match}</span>`;
  });
};


