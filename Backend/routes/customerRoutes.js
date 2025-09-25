import { Router } from 'express'
import { handleRegisterCustomer, handleLoginCustomer } from '../controllers/customerController.js'

const router = Router()

//Create a new employee
router.post('/register', handleRegisterCustomer)
router.post('/login', handleLoginCustomer)

export default router