import mongoose from "mongoose";
mongoose.set('strictQuery',false);

const connectDB = async () => {
    try {
        const  connect  = await mongoose.connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017/lms');
            console.log(`Connected to MongDB: ${connect.connection.host}`);
    } catch (error) {
        console.log("Not able to connect to the mongodb server");
        console.log(error); 
        process.exit(1);
    }
}

export default connectDB;