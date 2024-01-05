import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import { config } from "dotenv";
import cd_client from "./services";
config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3030;
//Midllewares//
app.use(cors());

app.use(cookieParser());
app.use(json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

//Bot Initialization//
cd_client.initialize();


//Routes
app.post("/convite-digital", async (req, res) => {
  const { recipients, message } = req.body;
  const serializedRecipients = recipients.map((recipient, i) => {
    const result = cd_client.sendMessage(`${recipient}@c.us`, message);

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
