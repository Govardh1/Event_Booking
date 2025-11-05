import { generateToken, verifyToken } from "authenticator";
import { TOTP_SECRET } from "../config.js";
 type TokenType="AUTH"|"ADMIN_AUTH"
export function getToken(number:string,type:TokenType){
	return generateToken(number+type+TOTP_SECRET)
}

export function VerifyTokenLib(number:string,type:TokenType,otp:string){
	return verifyToken(number+type+TOTP_SECRET,otp)
}