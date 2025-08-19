import dotenv from "dotenv"
import connectDB from "./db/index.js"
import {app} from "./app.js"

const port = process.env.PORT || 8000;

dotenv.config({
    path:"./.env"
    // path:"./.env.test"
});

connectDB()
.then(()=>{
    app.on("error",(err)=>{
        console.error('Mongoose Connection Error:',err);
    })
    app.listen(port,()=>{
        console.log(`server is running at port ${port}`);
    })
}).catch((err)=>{
    console.log("MONGO DB connection failed !!! ",err);
})