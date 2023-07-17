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