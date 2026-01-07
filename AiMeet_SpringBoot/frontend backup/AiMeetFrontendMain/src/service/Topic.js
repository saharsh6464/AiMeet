import instance from "../configuration/axiousSetup";


export const getTopic = async(id)=>{
    try{   
        const response = await instance.get(`/topics/user/${id}`);
        return response.data;
    }
    catch(e){
        console.log("Error Occuered From GetSubtopic APi end point",e);
    }
}


export const createTopic = async(data)=>{
    console.log(data);
    try{   
        const response = await instance.post(`/topics`,data);
        return response.data;
    }
    catch(e){
        console.log("Error Occuered From Create Topic APi end point",e);
    }
}