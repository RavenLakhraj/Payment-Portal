import bcrypt from 'bcrypt'
import { registerEmployee, checkEmployees } from '../models/employee.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/
const saltRounds = 10

async function handleRegisterEmployee(req, res) {
    try {
        const { email, password } = req.body

        //Validating email address format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        //Validating password
        if(!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password does not meet criteria." })
        }

        //Check if employee already exists
        const employeeExists = await checkEmployees(email)
        
        //If email is already in use
        if(employeeExists){
            return res.status(409).json({ message: "Email already in use."})
        }

        //Hashing and salting the password
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        //** CURRENTLY STORING PLAIN TEXT PASSWORD - REMOVE BEFORE SUBMISSION
        //Data to be stored in document
        const employeeData = { 
            email, 
            password,
            hashedPassword,
            role: 'employee',
            createdAt: new Date().toLocaleString()
        }

        const result = await registerEmployee(employeeData)

        if(result.insertedId) {
            return res.status(201).json({ message: 'Employee profile created successfully.' })
        } else {
            return res.status(500).json({ message: 'Failed to create employee profile.' })
        }
    } catch(err) {
        console.error(err)
        return res.status(500).json({ message: "Server error." })
    }
}

export { handleRegisterEmployee }