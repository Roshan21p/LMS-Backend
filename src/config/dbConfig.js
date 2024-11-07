import mongoose from "mongoose";
mongoose.set('strictQuery',false);

const connectDB = async () => {
    try {
        const  connect  = await mongoose.connect(process.env.DB_URL);
        
            console.log(`Connected to MongDB: ${connect.connection.host}`);
    } catch (error) {
        console.log("Not able to connect to the mongodb server");
        console.log(error); 
        process.exit(1);
    }
}

export default connectDB;