import { Router } from "express";
import userRouter from "../v1/user.js"
import adminRouter from "../v1/admin.js"
const router=Router()

router.use("/user",userRouter)
router.use("/admin",adminRouter)



export default router;