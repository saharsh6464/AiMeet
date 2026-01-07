import instance from "../configuration/axiousSetup";

export const RegisterUser = async(data)=>{
    try{
        const response = await instance.post("/users/register",data);
        console.log(response.data);
        return response.data;
    }
    catch(e){
        console.error("Error In Registering User:", e.response?.data || e.message);
    }
}


   
export const LoginUser = async(data)=>{
    try{
        console.log(data);
        const response = await instance.post("/users/login",data);
        console.log("✅ Login successful:", response.data);
        return response.data;
    }
    catch(e){
       console.error("❌ Error logging in user:", e.response?.data || e.message);
       throw e;
    }
}
