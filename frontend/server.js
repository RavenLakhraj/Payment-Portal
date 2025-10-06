import next from 'next';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const keysDir = path.join(__dirname, '../Backend/keys');
const sslOptions = {
  key: fs.readFileSync(path.join(keysDir, 'privatekey.pem')),
  cert: fs.readFileSync(path.join(keysDir, 'certificate.pem')),
  ca: fs.readFileSync(path.join(keysDir, 'CA.pem')),
};

(async () => {
  await app.prepare();

  https
    .createServer(sslOptions, (req, res) => handle(req, res))
    .listen(3000, () => {
      console.log('Frontend running at https://localhost:3000');
    });
})();
