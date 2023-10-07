import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// Exclude keys from user
function exclude(user, keys) {
	return Object.fromEntries(
		Object.entries(user).filter(([key]) => !keys.includes(key))
	);
}

export const registerUser = async (req, res, next) => {
	const { username, name, email, password } = req.body;

	if (!username || !name || !email || !password) {
		return next(errorHandler(400, "All fields are required"));
	}

	try {
		//check if user is already registered
		const emailExist = await prisma.user.findUnique({
			where: { email: email },
		});

		if (emailExist) {
			return next(errorHandler(400, "Email already exists"));
		}

		const usernameExist = await prisma.user.findUnique({
			where: { username: username },
		});

		if (usernameExist) {
			return next(errorHandler(400, "Uername already exists"));
		}

		const hashedPassword = bcrypt.hashSync(password, 12);

		const token = await jwt.sign(
			{ username: username, email: email },
			process.env.JWT_SECRET,
			{ expiresIn: "3D" }
		);

		if (token && hashedPassword) {
			const newUser = await prisma.user.create({
				data: {
					name,
					username,
					password: hashedPassword,
					email,
					isAdmin: false,
				},
			});

			const userWithoutPassword = exclude(newUser, ["password"]);

			return res.status(201).json({
				success: true,
				message: "User created successfully",
				user: userWithoutPassword,
				token,
			});
		}
	} catch (error) {
		return next(errorHandler(500, error.message));
	}
};

export const loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(errorHandler(400, "All fields are required"));
	}

	try {
		const userExist = await prisma.user.findUnique({
			where: { email: email },
		});

		if (!userExist) {
			return next(errorHandler(400, "User not found"));
		}

		//Compare password
      const passwordMatch = bcrypt.compareSync(password, userExist.password);


		if (!passwordMatch) {
			return next(errorHandler(400, "Invalid password"));
		}

		const token = await jwt.sign(
			{ username: userExist.username, email: email },
			process.env.JWT_SECRET,
			{ expiresIn: "3D" }
		);

		if (token && passwordMatch && userExist) {
			const userWithoutPassword = exclude(userExist, ["password"]);

			return res.status(200).json({
				success: true,
				message: "User logged in successfully",
				user: userWithoutPassword,
				token,
			});
		}
	} catch (error) {
		return next(errorHandler(500, error.message));
	}
};
