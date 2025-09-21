import { client } from '../db/db.js'

const db = client.db('Test')
const customersCollection = db.collection('Customers')

//Customer registration
async function registerCustomer(customerData) {
    return await customersCollection.insertOne(customerData)
}

//Checking if a customer with that email and account number exist
async function checkCustomers(email, idNumber, accountNumber) {
    const query = {
        $or: [
            { email: email },
            { accountNumber: accountNumber },
            { idNumber: idNumber }
        ]
    };
    return await customersCollection.countDocuments(query, { limit: 1 })
}

//Exporting functions
export { registerCustomer, checkCustomers }