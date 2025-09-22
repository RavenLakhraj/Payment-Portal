import { client } from '../db/db.js'

const db = client.db('Test')
const paymentsCollection = db.collection('Payment')

//Creating new payment profile
async function addPayment(paymentData) {
    return await paymentsCollection.insertOne(paymentData)
}

//Exporting functions
export { addPayment }