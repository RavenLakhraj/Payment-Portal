import jwt from 'jsonwebtoken'

export function authMiddleware(req, res, next) {
    // Support JWT in secure HttpOnly cookie first, then fall back to Authorization header
    const cookieToken = req.cookies?.token
    const header = req.headers.authorization
    const headerToken = header && header.startsWith('Bearer ')
        ? header.split(' ')[1]
        : null

    const token = cookieToken || headerToken
    if (!token) return res.status(401).json({ message: 'No token provided.' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: decoded.userId }
        next()
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token.' })
    }
}
