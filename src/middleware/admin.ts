import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import { ADMI_JWT_PASSWORD } from "../config.js";
import type { Payload } from "@prisma/client/runtime/library";

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) {
		res.status(401).json({
			msg: "unauthorized"
		})
		return
	}
	try {
		const decoded = jwt.verify(token, ADMI_JWT_PASSWORD)
		if (typeof decoded === "string") {
			return res.status(401).json({ msg: "unauthorized" });
		}
		req.userId = decoded.userId;
		next();
	} catch (error) {
		res.status(401).json({
			msg: "unauthorized"
		})
	}
}