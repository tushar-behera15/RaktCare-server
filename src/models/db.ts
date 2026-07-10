import mongoose from "mongoose";

const mongo_url = process.env.MONGO_URL;
mongoose.connect(mongo_url as string).then(() => {
    console.log("Database connected");
}).catch((err: any) => {
    console.log("Database connection failed", err);
})