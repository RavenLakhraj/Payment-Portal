import bcrypt from 'bcrypt'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { registerEmployee, checkEmployees, loginEmployee } from '../models/employee.js'

const nameRegex = /^[A-Za-z\s]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/
// const saltRounds = 10

export async function handleRegisterEmployee(req, res) {
    try {
        const { fullName, email, password } = req.body

        //Validating full name input
        if (!fullName || !nameRegex.test(fullName)) {
            return res.status(400).json({ message: 'Invalid name.' })
        }

        //Validating email address format
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address.' })
        }

        //Validating password
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ message: 'The password provided does not meet the minimum criteria.' })
        }

        //Check if employee already exists
        const employeeExists = await checkEmployees(email)

        //If email is already in use
        if (employeeExists) {
            return res.status(409).json({ message: 'Email already in use.' })
        }

        //Hashing and salting the password

        //'Basic hashing and salting' - OG way we were taught
        // const hashedPassword = await bcrypt.hash(password, saltRounds)

        //Hashing using Argon2; salts automatically; shows 'additional research'
        const hashedPassword = await argon2.hash(password, { type: argon2.argon2id })

        //Data to be stored in document
        const employeeData = {
            fullName,
            email,
            password: hashedPassword,
            role: 'employee',
            createdAt: new Date().toLocaleString()
        }

        const result = await registerEmployee(employeeData)

        if (result.insertedId) {
            return res.status(201).json({ message: 'Employee profile created successfully.' })
        } else {
            return res.status(500).json({ message: 'Failed to create employee profile.' })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error.' })
    }
}

export async function handleLoginEmployee(req, res) {
    try {
        const { email, password } = req.body

        const employee = await loginEmployee(email)

        if (!employee) {
            return res.status(401).json({ message: 'Invalid credentials.' })
        }

        const isPasswordValid = await argon2.verify(employee.password, password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' })
        }

        const token = jwt.sign(
            { userId: employee._id, role: 'employee' },
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
            role: 'employee'
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error' })
    }
}
