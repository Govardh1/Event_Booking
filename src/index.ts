import 'dotenv/config'; 
import  express  from "express";
import V1Router from "./routes/v1/index.js"
const PORT = process.env.PORT || 3000;

const app=express()
app.use(express.json())
app.use("/api/v1",V1Router)




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
export default app;