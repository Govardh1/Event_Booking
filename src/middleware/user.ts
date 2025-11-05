import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config.js";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) {
		res.status(401).json({
			msg: "unauthorized"
		})
		return
	}
	try {
		const decoded = jwt.verify(token, JWT_PASSWORD)
		if (typeof decoded === "string") {
			return res.status(401).json({ msg: "unauthorized" });
		}
		req.userId = decoded.userId
	} catch (error) {
		res.status(401).json({
			msg: "unauthorized"
		})
	}
}