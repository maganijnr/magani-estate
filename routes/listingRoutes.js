import express from 'express'
import { protect } from '../middleware/protectRoute.js'
import { createListing, getAllListing } from '../controllers/listingController.js'


const router = express.Router()

router.post('/create', protect, createListing)
router.get('/', getAllListing)


export default router