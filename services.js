import { Client } from 'whatsapp-web.js';
import { generate } from "qrcode-terminal";
const client = new Client({
    puppeteer:{
        args: ['--no-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED');
    console.log(qr)
    generate(qr,{small:true});
});

client.on('ready', () => {
    console.log('Client is ready!');
   
});
client.on("authenticated", (session) => {})



export default client