import https from 'https'
import fs from 'fs'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { connect } from './db/db.js'

import employeeRoutes from './routes/employeeRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT

// Trust proxy so secure cookies and HSTS work correctly behind proxies/load balancers
app.set('trust proxy', 1)

// CORS (adjust origin to your frontend domain for production)
app.use(cors({ origin: true, credentials: true }))

// Parse JSON and cookies early
app.use(express.json())
app.use(cookieParser())

// Security: set common hardening headers (clickjacking, HSTS, no-sniff, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      // Prevent the app from being embedded in iframes (anti-clickjacking)
      'frame-ancestors': ["'none'"],
      // Allow only same-origin by default
      'default-src': ["'self'"],
      'script-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'data:'],
      'connect-src': ["'self'", 'https:'],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    }
  },
}))

// Rate limiting to reduce brute-force and token stuffing
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(limiter)

// Prevent HTTP parameter pollution
app.use(hpp())

// Sanitize user-supplied data to prevent NoSQL/SQL injection-like payloads
app.use(mongoSanitize())

// Routes
app.use('/employees', employeeRoutes)
app.use('/customers', customerRoutes)
app.use('/payments', paymentRoutes)

// Health route
app.get('/', (_, res) => {
  res.send('HTTPS server is running securely!')
})

// Create HTTPS server
const server = https.createServer(
  {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem'),
    // added CA just in case
    ca: fs.readFileSync('keys/CA.pem'),
  },
  app
)

// Connect to Mongo database
connect()

// Start server
server.listen(port, () => {
  console.log(`Server started on PORT ${port}`)
})
