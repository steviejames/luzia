import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { config } from "dotenv";


import { Client } from "whatsapp-web.js";
import qrTerminal from "qrcode-terminal";

config();
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3030;
const client = new Client({
  puppeteer: {
    args: ["--no-sandbox"],
    headless: false,
    
  },
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED");
  console.log("Code: " + qr);
 qrTerminal.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});
client.on("authenticated", (session) => {});

//Midllewares//
app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//Bot Initialization//
client.initialize();


//Routes
app.post("/convite-digital", async (req, res) => {
  const { recipients, message } = req.body;
  const serializedRecipients = recipients.map((recipient, i) => {
    const result = client.sendMessage(`${recipient}@c.us`, message);

    return result;
  });

  try {
    const result = await Promise.all(serializedRecipients);
    res.send({
      message: "Succeso!",
      data: result.map((item) => item.id.remote),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

//Server Initialization//
app.listen(port, () => {
  console.log(`Whatsapp Server Running on port ${port}`);
});
