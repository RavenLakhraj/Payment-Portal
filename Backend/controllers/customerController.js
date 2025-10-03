import bcrypt from 'bcrypt'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { registerCustomer, checkCustomers, loginCustomer } from '../models/customer.js'

const nameRegex = /^[A-Za-z\s-]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/
const idNumberRegex = /^\d{13}$/
const accountNumberRegex = /^\d{9,12}$/
// const saltRounds = 10

export async function handleRegisterCustomer(req, res) {
    try {
        console.log('Incoming customer registration:', req.body);
        try {
          fs.appendFileSync('logs/register.log', `${new Date().toISOString()} INCOMING: ${JSON.stringify(req.body)}\n`);
        } catch (e) {
          console.warn('Failed to write register log', e);
        }

        const {
            fullName,
            idNumber,
            accountNumber,
            email,
            password
        } = req.body

        //Validating full name input
        if(!fullName || !nameRegex.test(fullName)) {
            console.warn('Validation failed: fullName', fullName);
            return res.status(400).json({ message: 'Invalid name.'})
        }

        //Validating ID number
        if(!idNumber || !idNumberRegex.test(idNumber)) {
            console.warn('Validation failed: idNumber', idNumber);
            return res.status(400).json({ message: 'Invalid ID number.' })
        }

        //Validating account number
        if(!accountNumber || !accountNumberRegex.test(accountNumber)) {
            console.warn('Validation failed: accountNumber', accountNumber);
            return res.status(400).json({ message: 'Invalid account number' })
        }

        //Validating email address format
        if (!email || !emailRegex.test(email)) {
            console.warn('Validation failed: email', email);
            return res.status(400).json({ message: 'Invalid email address.' })
        }

        //Validating password
        if(!password || !passwordRegex.test(password)) {
            console.warn('Validation failed: password criteria');
            return res.status(400).json({ message: 'Password does not meet criteria.' })
        }

        //Check if customer already exists
        const customerExists = await checkCustomers(email, idNumber, accountNumber)

        //If the credentials are already in use
        if(customerExists){
            console.warn('Attempt to register duplicate customer');
            return res.status(409).json({ message: 'Customer with these details already exists.'})
        }

        //Hashing and salting the password
        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id })

        //Data to be stored in document
        const customerData = {
            fullName,
            idNumber,
            accountNumber,
            email,
            password: hashedPassword,
            role: 'customer',
            createdAt: new Date().toISOString()
        }

        console.log('Registering customer to DB', { fullName, idNumber, accountNumber, email });
        const result = await registerCustomer(customerData)

        try {
          fs.appendFileSync('logs/register.log', `${new Date().toISOString()} DB_RESULT: ${JSON.stringify(result)}\n`);
        } catch (e) { console.warn('Failed to write DB_RESULT log', e); }

        if(result.insertedId) {
            console.log('Customer registered:', result.insertedId);
            try { fs.appendFileSync('logs/register.log', `${new Date().toISOString()} SUCCESS: ${result.insertedId}\n`); } catch (e) {}
            return res.status(201).json({ message: 'Customer registered successfully.' })
        } else {
            console.error('Insert did not return an insertedId', result);
            try { fs.appendFileSync('logs/register.log', `${new Date().toISOString()} FAILED_INSERT: ${JSON.stringify(result)}\n`); } catch (e) {}
            return res.status(500).json({ message: 'Failed to register customer profile.' })
        }
    } catch(err) {
        console.error('Register error:', err)
        try { fs.appendFileSync('logs/register.log', `${new Date().toISOString()} ERROR: ${err.stack || err}\n`); } catch (e) {}
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
