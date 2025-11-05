import { Router } from "express";
import { generateKey, generateToken, verifyToken } from "authenticator"
const router = Router()
import 'dotenv/config';
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { ADMI_JWT_PASSWORD, JWT_PASSWORD, TOTP_SECRET } from "../../config.js";
import { sendMessage } from "../../utils/twilio.js";
import { getToken, VerifyTokenLib } from "../../utils/totp.js";
const client = new PrismaClient()

router.post("/signin", async (req, res) => {
	const number = req.body.phone_Number
	const totp = getToken(number,"ADMIN_AUTH")
	try{
		await client.admin.findFirstOrThrow({
			where:{number}
		})
	}catch(err){
		throw new Error("Error from admin signup ep");
	}

	if (process.env.NODE_ENV == "production") {
		try {
			await sendMessage(`your OTP for logging in is ${totp}`, number)

		} catch (error) {
			console.error("Twilio error:", error);
			throw new Error("error from twilio");
		}
	}
	res.json({
		msg:"otp sent"
	})

})

router.post("/signin/verify", async (req, res) => {
	const number = req.body.phone_Number
	const otp=req.body.totp;
	if (process.env.NODE_ENV==="production" && !VerifyTokenLib(number,"ADMIN_AUTH",otp)) {
		res.json({
			message: "invalid token"
		})
		return
	}
	const user=await client.user.findFirstOrThrow({
	 where: { number },
  });
	const token = jwt.sign({ UserId:user.id }, ADMI_JWT_PASSWORD)
	res.json({
		token
	})
})

export default router;