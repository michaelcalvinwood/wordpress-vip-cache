const remoteHost = 'https://pymnts-com.go-vip.net'
const paths = [
    '/'
]

const listenPort = 5235;
const hostname = 'node.pymnts.com'
const privateKeyPath = `/etc/letsencrypt/live/${hostname}/privkey.pem`;
const fullchainPath = `/etc/letsencrypt/live/${hostname}/fullchain.pem`;

const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

const app = express();
app.use(express.static('public'));
app.use(express.json({limit: '200mb'})); 
app.use(cors());

const cacheWordPressVIP = async (req, res) => {
    res.status(200).send('OK');

    for (let i = 0; i < paths.length; ++i) {
        const request = {
            url: paths[i].indexOf('?') === -1 ? remoteHost + paths[i] + '?cache=use' : remoteHost + paths[i] + '&cache=use',
            method: 'GET'
        }

        try {
            response = await axios(request);
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    }
}

app.get('/', (req, res) => {
    res.send('Hello, Ken!');
});

app.post('/cache-wordpress-vip', (req, res) => cacheWordPressVIP(req, res))


const httpsServer = https.createServer({
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(fullchainPath),
  }, app);
  
  httpsServer.listen(listenPort, '0.0.0.0', () => {
    console.log(`HTTPS Server running on port ${listenPort}`);
});

