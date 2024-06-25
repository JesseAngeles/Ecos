import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const mongoURL = 'mongodb://127.0.0.1:27017/ecos';
        await mongoose.connect(mongoURL);

        console.log('Mongo connected');
    } catch (error) {
        console.error('Error connecting Mongo', error);
        process.exit(1);        
    }
};

export default connectDB;
