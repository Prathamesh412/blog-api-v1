const mongoose = require('mongoose')

//function to connect

const dbConnect = async () =>{
     try{
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected sucessfully")
     }catch(error){
        console.log(error)
        process.exit(1)
     }
}


dbConnect();