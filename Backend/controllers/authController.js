import jwt from 'jsonwebtoken'
import { client } from '../db/db.js';

const db = client.db('Test');
const employeesCollection = db.collection('Employees');
const customersCollection = db.collection('Customers');

async function handleLogin(req, res) {
    try{
        const { email, password } = req.body

        //Check if an employee is logging in
        let user = await employeesCollection.findOne({ email })
        let role = "employee"

        //If not employee, check if a customer is logging in
        if(!user) {
            user = await await customersCollection.findOne({ email })
            role = "customer"
        }

        //No matching email address found in collections
        if(!user) {
            return res.status(401).json({ message: "Invalid credentials." })
        }

        //Email address found; check password
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        //Upon successful login, sign jwt
        const token = jwt.sign(
            { userId: user._id, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        return res.status(200).json({ message: `Login successful. Role: ${ role }`, token })

    } catch {
        console.error(err);
        return res.status(500).json({ message: "Server error." });
    }
}

export { handleLogin }