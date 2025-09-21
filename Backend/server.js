import https from 'https'
import fs from 'fs'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { connect } from './db/db.js'

import employeeRoutes from './routes/employeeRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import authRoutes from './routes/authRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(cors())

//Middleware
app.use(express.json())
app.use('/employees', employeeRoutes)
app.use('/customers', customerRoutes)
app.use('/login', authRoutes)

//Test route
app.get("/", (_, res) => {
  res.send("🚀 HTTPS server is running securely!")
})

//Create HTTPS server
const server = https.createServer(
  {
    key: fs.readFileSync("keys/privatekey.pem"),
    cert: fs.readFileSync("keys/certificate.pem"),
  },
  app
)

//Connecting to Mongo database
connect()

//Start server
server.listen(port, () => {
  console.log(`Server started on PORT ${port}`);
})