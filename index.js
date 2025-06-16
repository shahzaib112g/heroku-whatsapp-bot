const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const app = express();
const port = process.env.PORT || 3000;

// Create WhatsApp client with session auto-save
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  }
});

let qrCodeImage = '';

client.on('qr', async (qr) => {
  console.log('🔐 QR RECEIVED');
  qrCodeImage = await qrcode.toDataURL(qr);
});

client.on('ready', () => {
  console.log('✅ WhatsApp Bot is ready!');
});

client.on('authenticated', () => {
  console.log('🔓 Authenticated');
});

client.on('auth_failure', () => {
  console.log('❌ Authentication failed');
});

client.initialize();

// Route: show QR
app.get("/qr", (req, res) => {
  if (qrCodeImage) {
    res.send(`
      <h2>📱 Scan QR Code with WhatsApp</h2>
      <img src="${qrCodeImage}" />
    `);
  } else {
    res.send("🕒 QR not ready yet. Please wait and refresh...");
  }
});

app.get("/", (req, res) => {
  res.send("✅ Bot is running. Go to /qr to scan WhatsApp QR.");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
