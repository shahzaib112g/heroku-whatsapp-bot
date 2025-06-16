const express = require("express");
const fs = require("fs");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");

const app = express();
const port = process.env.PORT || 3000;

let qrCodeData = "";

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "session" }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on("qr", (qr) => {
  qrCodeData = qr;
  console.log("QR RECEIVED");
});

client.on("ready", () => {
  console.log("🟢 WhatsApp bot is ready!");
});

client.on("authenticated", () => {
  console.log("✅ Authenticated!");
});

client.on("auth_failure", () => {
  console.error("❌ Authentication failure!");
});

client.initialize();

// QR route
app.get("/qr", async (req, res) => {
  if (!qrCodeData) return res.send("QR not ready, refresh in a few seconds.");
  const qrImage = await qrcode.toDataURL(qrCodeData);
  res.send(`<img src="${qrImage}" /> <p>Scan QR to connect WhatsApp</p>`);
});

app.listen(port, () => {
  console.log("🌐 Server running on port", port);
});
