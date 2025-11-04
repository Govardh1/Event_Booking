import { Router } from "express";
import {generateKey,generateToken, verifyToken} from "authenticator"
const router=Router()
import 'dotenv/config'; 
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JWT_PASSWORD } from "../../config.js";
 const client=new PrismaClient()
router.post("/signup",async(req,res)=>{
	const number=req.body.phone_Number
	const totp= generateToken(number + "SIGNUP")
	client.user.upsert({
		where:{
			number
		},
		create:{
			number
		},
		update:{

		}
	})
	if (process.env.NODE_ENV=="production") {

	}
	res.json({
		totp
	})

})
router.post("/signup/verify",async(req,res)=>{
	const number=req.body.phone_Number
	const name=req.body.name
	const totp= generateToken(number + "SIGNUP")
	if (!verifyToken(number + "SIGNUP" ,req.body.otp)) {
		res.json({
			message:"invalid token"
		})
		return
	}
	const UserId=await client.user.update({
		where:{
			number
		},
		data:{
			verified:true,
			name
		}
	})
	const token=jwt.sign({UserId},JWT_PASSWORD)
	res.json({
		token
	})


})

export default router;