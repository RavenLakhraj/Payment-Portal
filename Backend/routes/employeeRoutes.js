import { Router } from 'express'
import { handleRegisterEmployee, handleLoginEmployee } from '../controllers/employeeController.js'

const router = Router()

//Create a new employee
router.post('/register', handleRegisterEmployee)
router.post('/login', handleLoginEmployee)

export default router