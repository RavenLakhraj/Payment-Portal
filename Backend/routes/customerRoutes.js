import { Router } from 'express'
import { handleRegisterCustomer } from '../controllers/customerController.js'

const router = Router()

//Create a new employee
router.post('/register', handleRegisterCustomer)

export default router