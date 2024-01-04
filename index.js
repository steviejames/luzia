// Supports ES6
import { create } from "@wppconnect-team/wppconnect";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config();
const port = process.env.PORT || 3333;

const app = express();

app.use(express.urlencoded());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//Starts the bot
const wpp = create({ session: "luzia-bot" });

app.post("/whatsapp", async (req, res) => {
  const client = await wpp;
  const { recipients, message } = req.body;
  const serializedRecipients = recipients.map((recipient, i) => {
    const result = client.sendText(`${recipient}@c.us`, message);
    return result;
  });

  try {
    const result = await Promise.all(serializedRecipients);
    res.send({
      message: "Succeso!",
      data: result.map((item) => item.to.split("@")[0]),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
})

app.get("/whatsapp", async (req, res) => {
  const client = await wpp;
  client.res.send("Hello World, im Running"  + client.session);
})
app.get("/", async (req, res) => {
  const client = await wpp;
  client.res.send("Hello World, im Running");
});

app.listen(port, () => {
  console.log("Server running on PORT: " + port);
});
