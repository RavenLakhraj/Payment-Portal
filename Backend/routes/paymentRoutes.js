import { Router } from 'express'
import { handleAddPayment } from '../controllers/paymentController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

//Create a new payment profile (customers only)
router.post('/make-payment', authMiddleware, handleAddPayment)

export default router