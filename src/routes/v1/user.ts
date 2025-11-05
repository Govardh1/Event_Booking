import { Router } from "express";
import { generateKey, generateToken, verifyToken } from "authenticator"
const router = Router()
import 'dotenv/config';
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JWT_PASSWORD, TOTP_SECRET } from "../../config.js";
import { sendMessage } from "../../utils/twilio.js";
import { getToken, VerifyTokenLib } from "../../utils/totp.js";
const client = new PrismaClient()

router.post("/signup", async (req, res) => {
	const number = req.body.phone_Number
	const totp = getToken(number,"AUTH")
	await client.user.upsert({
		where: {number},
		create: {number},
		update: {}
	})
	console.log("DEBUG: Sending OTP to number =>", number);
	if (process.env.NODE_ENV == "production") {
		try {
			await sendMessage(`your OTP for logging in is ${totp}`, number)

		} catch (error) {
			console.error("Twilio error:", error);
			throw new Error("error from twilio");
		}
	}
	res.json({
		totp
	})

})

router.post("/signup/verify", async (req, res) => {
	const number = req.body.phone_Number
	const name = req.body.name
	const otp=req.body.totp;
	if (process.env.NODE_ENV==="production" && !VerifyTokenLib(number,"AUTH",otp)) {
		res.json({
			message: "invalid token"
		})
		return
	}
	const user=await client.user.update({
    where: { number },
    data: { verified: true, name },
  });
	const token = jwt.sign({ UserId:user.id }, JWT_PASSWORD)
	res.json({
		token
	})
})

router.post("/signin", async (req, res) => {
	const number = req.body.phone_Number
	const totp = getToken(number,"AUTH")
	
	// console.log("DEBUG: Sending OTP to number =>", number);
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
	if (process.env.NODE_ENV==="production" && !VerifyTokenLib(number,"AUTH",otp)) {
		res.json({
			message: "invalid token"
		})
		return
	}
	const user=await client.user.findFirstOrThrow({
   	 where: { number },
  });
	const token = jwt.sign({ UserId:user.id }, JWT_PASSWORD)
	res.json({
		token
	})
})

export default router;