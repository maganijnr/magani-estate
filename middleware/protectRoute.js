import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { errorHandler } from "../utils/error.js";
import exclude from "../utils/exclude.js";

export const protect = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
		const decode = jwt.verify(token, process.env.JWT_SECRET);

		const { email } = decode;

		const user = await prisma.user.findUnique({
			where: { email: email },
		});

		if (!user) {
			return next(errorHandler(400, "User does not exist"));
		}

		const userWithoutPassword = exclude(user, ["password"]);

		req.user = userWithoutPassword;
	}

	if (!token) {
		return next(errorHandler(401, "Not authorized, log in"));
		// res.status(401);
		// throw new Error("Not authorized, log in");
	}

	next();
};
