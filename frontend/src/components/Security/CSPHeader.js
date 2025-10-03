"use client"

import { useEffect } from "react"

export default function CSPHeader() {
  useEffect(() => {
    // Clickjacking Prevention:
    // 1. frame-ancestors 'none' - Prevents the app from being embedded in iframes
    // 2. X-Frame-Options: DENY - Legacy browser support for iframe prevention
    // 3. default-src 'self' - Restricts resource loading to same origin
    // These headers work together to prevent attackers from embedding the site in malicious frames
    
    const meta = document.createElement("meta")
    meta.httpEquiv = "Content-Security-Policy"
    meta.content =
      "frame-ancestors 'none'; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
    document.head.appendChild(meta)

    const frameOptions = document.createElement("meta")
    frameOptions.httpEquiv = "X-Frame-Options"
    frameOptions.content = "DENY"
    document.head.appendChild(frameOptions)

    const contentType = document.createElement("meta")
    contentType.httpEquiv = "X-Content-Type-Options"
    contentType.content = "nosniff"
    document.head.appendChild(contentType)

    return () => {
      document.head.removeChild(meta)
      document.head.removeChild(frameOptions)
      document.head.removeChild(contentType)
    }
  }, [])

  return null
}
