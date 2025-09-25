import { Router } from 'express'
import { handleAddPayment, handleFetchPayments, handleUpdatePaymentStatus } from '../controllers/paymentController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

//Create a new payment profile (customers only)
router.post('/make-payment', authMiddleware, handleAddPayment)
router.get('/', authMiddleware, handleFetchPayments)
router.patch('/:id/status', authMiddleware, handleUpdatePaymentStatus)

export default router