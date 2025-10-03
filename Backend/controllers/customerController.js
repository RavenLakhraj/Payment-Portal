import bcrypt from 'bcrypt'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { registerCustomer, checkCustomers, loginCustomer } from '../models/customer.js'

const nameRegex = /^[A-Za-z\s-]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/
const idNumberRegex = /^\d{13}$/
const accountNumberRegex = /^\d{9,12}$/
// const saltRounds = 10

export async function handleRegisterCustomer(req, res) {
    try {
        const { 
            fullName,
            idNumber,
            accountNumber,
            email, 
            password 
        } = req.body

        //Validating full name input
        if(!fullName || !nameRegex.test(fullName)) {
            return res.status(400).json({ message: 'Invalid name.'})
        }

        //Validating ID number
        if(!idNumber || !idNumberRegex.test(idNumber)) {
            return res.status(400).json({ message: 'Invalid ID number.' })
        }

        //Validating account number
        if(!accountNumber || !accountNumberRegex.test(accountNumber)) {
            return res.status(400).json({ message: 'Invalid account number' })
        }

        //Validating email address format
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address.' })
        }

        //Validating password
        if(!password || !passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Password does not meet criteria.' })
        }

        //Check if customer already exists
        const customerExists = await checkCustomers(email, idNumber, accountNumber)
        
        //If the credentials are already in use
        if(customerExists){
            return res.status(409).json({ message: 'Customer with these details already exists.'})
        }

        //Hashing and salting the password

        //'Basic hashing and salting' - OG way we were taught
        // const hashedPassword = await bcrypt.hash(password, saltRounds)

        //Hashing using Argon2; salts automatically; shows 'additional research'
        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id })

        //Data to be stored in document
        const customerData = { 
            fullName,
            idNumber,
            accountNumber,
            email, 
            password: hashedPassword,
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
        return res.status(500).json({ message: 'Server error.' })
    }
}

export async function handleLoginCustomer(req, res) {
    try{
        const { email, accountNumber, password } = req.body

        const customer = await loginCustomer(email, accountNumber)

        if(!customer) {
            return res.status(401).json({ message: 'Invalid credentials.' })
        }

        const isPasswordValid = await argon2.verify(customer.password, password)

        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' })
        }        

        const token = jwt.sign(
            { userId: customer._id, role: 'customer' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        // Mitigate session hijacking by storing the JWT in an HttpOnly, Secure, SameSite=Strict cookie
        res.cookie('token', token, {
            httpOnly: true, // not accessible to JS
            secure: true,   // sent only over HTTPS
            sameSite: 'strict', // CSRF mitigation
            maxAge: 60 * 60 * 1000,
        })

        return res.status(200).json({
            message: 'Login successful',
            role: 'customer'
        })
    } catch(err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
}
