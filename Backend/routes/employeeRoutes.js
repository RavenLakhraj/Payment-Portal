import { Router } from 'express'
import { handleRegisterEmployee } from '../controllers/employeeController.js'

const router = Router()

//Create a new employee
router.post("/", handleRegisterEmployee);

export default router