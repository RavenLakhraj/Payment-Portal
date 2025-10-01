"use client"

import { useEffect } from "react"

export default function CSPHeader() {
  useEffect(() => {
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
