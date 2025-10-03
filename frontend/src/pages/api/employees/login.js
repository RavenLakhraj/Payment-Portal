import https from 'https';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    const payload = JSON.stringify(req.body || {});
    const options = {
      hostname: '127.0.0.1',
      port: 2001,
      path: '/employees/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      let body = '';
      proxyRes.on('data', (chunk) => (body += chunk));
      proxyRes.on('end', () => {
        const status = proxyRes.statusCode || 502;
        let parsed = null;
        try {
          parsed = JSON.parse(body || '{}');
        } catch (e) {
          parsed = { raw: body };
        }
        return res.status(status).json(parsed);
      });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error', err && (err.stack || err));
      try { require('fs').appendFileSync('frontend_logs_proxy.txt', `${new Date().toISOString()} PROXY_ERROR: ${String(err && (err.stack || err))}\n`); } catch (e) {}
      return res.status(502).json({ message: 'Proxy request error', detail: String(err && (err.stack || err)) });
    });

    proxyReq.write(payload);
    proxyReq.end();
  } catch (err) {
    console.error('API proxy error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
