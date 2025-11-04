import { Router } from "express";
import userRouter from "../v1/user.js"

const router=Router()

router.use("/user",userRouter)



export default router;