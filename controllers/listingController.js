import { errorHandler } from "../utils/error.js";
import prisma from "../config/prisma.js";

export const createListing = async (req, res, next) => {
	const user = req.user;
	const {
		name,
		description,
		address,
		regularPrice,
		discountPrice,
		bathrooms,
		bedrooms,
		furnished,
		rent,
		imageUrls,
		sale,
	} = req.body;

	if (!name) {
		return next(errorHandler(401, "Name is required"));
	}

	if (!address) {
		return next(errorHandler(401, "Address is required"));
	}

	if (!regularPrice) {
		return next(errorHandler(401, "Price is required"));
	}

	if (imageUrls.length === 0) {
		return next(errorHandler(401, "Image is required"));
	}

	try {
		const listing = await prisma.listing.create({
			data: {
				name,
				description,
				address,
				regularPrice,
				discountPrice,
				bathrooms,
				furnished,
				rent,
				imageUrls,
				sale,
				bedrooms,
				creatorId: user.id,
			},
		});
		return res.status(201).json({
			success: true,
			message: "Successfully created listing.",
			listing: listing,
		});
	} catch (error) {
		return next(errorHandler(500, error.message));
	}
};

export const getAllListing = async (req, res, next) => {
	try {
		const listings = await prisma.listing.findMany();

		return res
			.status(200)
			.json({ success: true, message: "Listings", listings: listings });
	} catch (error) {
		return next(errorHandler(500, error.message));
	}
};
