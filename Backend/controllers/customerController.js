import bcrypt from 'bcrypt'
import { registerCustomer, checkCustomers } from '../models/customer.js'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/
const idNumberRegex = /^\d{13}$/
const accountNumberRegex = /^\d{16}$/
const saltRounds = 10

async function handleRegisterCustomer(req, res) {
    try {
        const { 
            fullName,
            idNumber,
            accountNumber,
            email, 
            password 
        } = req.body

        //Validating email address format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address." })
        }

        //Validating password
        if(!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password does not meet criteria." })
        }

        //Validating ID number
        if(!idNumberRegex.test(idNumber)) {
            return res.status(400).json({ message: "Invalid ID number." })
        }

        //Validating account number
        if(!accountNumberRegex.test(accountNumber)) {
            return res.status(400).json({ message: "Invalid account number" })
        }

        //Check if customer already exists
        const customerExists = await checkCustomers(email, idNumber, accountNumber)
        
        //If email is already in use
        if(customerExists){
            return res.status(409).json({ message: "Customer with these details already exists."})
        }

        //Hashing and salting the password
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        //** CURRENTLY STORING PLAIN TEXT PASSWORD - REMOVE BEFORE SUBMISSION
        //Data to be stored in document
        const customerData = { 
            fullName,
            idNumber,
            accountNumber,
            email, 
            password,
            hashedPassword,
            role: 'customer',
            createdAt: new Date().toLocaleString()
        }

        const result = await registerCustomer(customerData)

        if(result.insertedId) {
            return res.status(201).json({ message: 'Customer registered successfully.' })
        } else {
            return res.status(500).json({ message: 'Failed to register customer profile.' })
        }
    } catch(err) {
        console.error(err)
        return res.status(500).json({ message: "Server error." })
    }
}

export { handleRegisterCustomer }