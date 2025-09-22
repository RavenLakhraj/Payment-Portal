import { addPayment } from '../models/payment.js'

const amountRegex = /^\d+(\.\d{1,2})?$/
const payeeNameRegex = /^[A-Za-z\s]+$/
const payeeAccountNumberRegex = /^\d{9,12}$/
const swiftCodeRegex = /^[A-Za-z0-9]{8,11}$/

async function handleAddPayment(req, res) {
    try {
        const {
            amount,
            currency,
            provider,
            payeeName,
            payeeAccountNumber,
            swiftCode
        } = req.body

        //Validating amount input
        if (!amount || !amountRegex.test(amount)) {
            return res.status(400).json({ message: 'Invalid amount value.' })
        }

        //Validating payee name input
        if (!payeeName || !payeeNameRegex.test(payeeName)) {
            return res.status(400).json({ message: 'Invalid payee name.' })
        }

        //Validating payee account number input
        if (!payeeAccountNumber || !payeeAccountNumberRegex.test(payeeAccountNumber)) {
            return res.status(400).json({ message: 'Invalid payee account.' })
        }

        //Validating swift code input
        if (!swiftCode || !swiftCodeRegex.test(swiftCode)) {
            return res.status(400).json({ message: 'Invalid SWIFT code.' })
        }

        //Validating currency selection
        if (!currency) {
            return res.status(400).json({ message: 'No currency selected.' })
        }

        //Validating provider selection
        if (!provider) {
            return res.status(400).json({ message: 'No payment provider selected.' })
        }

        //Current user's ID
        const customerId = req.user.userId

        //Data to be stored in payment profile
        const paymentData = {
            customerId,
            amount,
            currency,
            provider,
            payeeName,
            payeeAccountNumber,
            swiftCode,
            status: 'Pending',
            createdAt: new Date().toLocaleString()
        }

        const result = await addPayment(paymentData)

        if (result.insertedId) {
            return res.status(201).json({ message: 'Payment submitted for verification.' })
        } else {
            return res.status(500).json({ message: 'Failed to make payment.' })
        }

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Server error.' })
    }
}

export { handleAddPayment }