import mongoose from "mongoose";

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error ${err}`));
dbConnection.once("open", () => console.log("Connected to DB!"));

const mongooseConnection = async()=>{

    try{
        const conn = await mongoose.connect("mongodb+srv://aftabemir123:XNxBrpXBPzRv5clM@cluster0.acbx9fb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }catch(error){
        console.log(`error :${error.message}`)
        process.exit(1);
    }
}    

export default mongooseConnection;