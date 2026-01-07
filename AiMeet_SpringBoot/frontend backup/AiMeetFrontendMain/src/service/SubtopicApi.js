import instance from "../configuration/axiousSetup";

export const getSubtopic = async(data1)=>{
    try{
        console.log(data1);
        const response = await instance.post("/subtopics/topic",data1);
        return response.data;
    }
    catch(e){
        console.log("Error Occuered From GetSubtopic APi end point",e);
    }
}


// Create a new subtopic. Backend expects POST /api/subtopics with
// request params: name (String) and topicId (Long).
// Create a new subtopic using the SubtopicDto structure expected by backend:
// { topicAccessId, accessPassword, startTime, endTime }
export const createSubtopic = async ({ topicAccessId, accessPassword, startTime, endTime }) => {
    try {
        const payload = { topicAccessId, accessPassword, startTime, endTime };
        console.log('createSubtopic payload', payload);
        // POST JSON body to /subtopics (backend controller's create mapping)
        const response = await instance.post('/subtopics', payload);
        return response.data;
    } catch (e) {
        console.error('Error Occurred in createSubtopic API endpoint', e);
        throw e;
    }
};

