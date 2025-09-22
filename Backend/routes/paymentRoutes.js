import { Router } from 'express'
import { handleAddPayment } from '../controllers/paymentController.js'

const router = Router()

//Create a new payment profile (customers only)
router.post('/makePayment', handleAddPayment)

export default router